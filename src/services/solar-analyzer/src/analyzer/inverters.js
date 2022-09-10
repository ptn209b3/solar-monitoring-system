/**
 * module config const
 */
const PRECISION = 2;
const STRING_CURRENT_DEVIATION_NAME = "deviation";
const PRODUCTION_HOURLY_NAME = "EHour";
const PRODUCTION_DAILY_NAME = "EDay";
const PRODUCTION_MONTHLY_NAME = "EMonth";
const PRODUCTION_YEARLY_NAME = "EYear";
const QUEQUE_TIMEOUT = 500;
//
const { default: RedisClient } = require("@redis/client/dist/lib/client");
const { default: axios } = require("axios");
const Recorder = require("../models");
const { Queues } = require("../lib");
const debugProduction = require("debug")("inverter:production");
const debugCurrent = require("debug")("inverter:current");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

const { deviation } = require("../math");

/**
 * @typedef {{id: string, currents: Array.<string>, production: string}} inverter
 * @typedef {{subscriber: RedisClient, publisher: RedisClient}} RedisClients
 */
class Inverter {
  id;
  currents = [];
  production = null;
  /**
   * class constructor
   * @param {inverter} inverter inverter object
   * @param {RedisClients} RedisClients redis pub and sub clients
   */
  constructor(inverter, RedisClients) {
    //init class properties
    this.id = inverter.id;
    this.currents = [...inverter.currents];
    this.production = inverter.production;
    this.site = inverter.site;
    //init class pub/sub
    this.subscriber = RedisClients.subscriber;
    this.publisher = RedisClients.publisher;

    //init current queques
    this.queque = new Queues(
      this.currents,
      this.#handleCurrentChange,
      QUEQUE_TIMEOUT
    );

    for (const current of this.currents) {
      this.subscriber.subscribe(
        `telemetry.${this.id}.${current}`,
        (message, channel) => {
          const { value, timestamp } = this.#messageParser(message);
          const [_, __, thisChannel] = channel.split(".");
          this.queque.add(timestamp.getTime(), { value, field: thisChannel });
        }
      );
    }
    this.subscriber.subscribe(
      `telemetry.${this.id}.${this.production}`,
      (message, channel) => {
        this.#handleProductionChange(this.#messageParser(message));
      }
    );
  }
  /**
   * unsubscribe channels
   */
  async destroy() {
    for (const current of this.currents) {
      await this.subscriber.unsubscribe(`telemetry.${this.id}.${current}`);
    }
    await this.subscriber.unsubscribe(
      `telemetry.${this.id}.${this.production}`
    );
  }
  /**
   * handler when current queue is full or timeout
   * @param {{id: any, queue: object}} queueResult
   * @param {boolean} isTimeout
   * handleCurrentChange must be an arrow function because it will be called in another class,
   * "this" pointer will be undefined if this method is a 'function' method
   */
  #handleCurrentChange = async (queueResult, isTimeout) => {
    const { id, queue } = queueResult;
    let records;
    if (isTimeout) {
      const queryRecords = this.currents
        .filter((current) => !Object.keys(queue).some((e) => e === current))
        .map((current) => {
          return axios.get(`${RECORD_ENGINE_URL}/record`, {
            params: {
              entityId: id,
              field: current,
              operator: "last",
              unit: "day",
              to: new Date(id),
            },
          });
        });
      records = (await Promise.all(queryRecords))
        .map(({ data }) => data)
        .flat()
        .map(({ value }) => Number(value));
    } else {
      records = Object.values(queue).map((e) => Number(e));
    }
    const result = deviation(records);
    await this.#updateOrCreate(
      {
        field: STRING_CURRENT_DEVIATION_NAME,
        timestamp: new Date(id),
      },
      result
    );
  };

  /**
   * handler when production change
   * @param {{value: any, timestamp: Date}} message
   */
  async #handleProductionChange(message) {
    const { id } = this;
    const { value, timestamp: time } = message;
    debugProduction("Production has changed: " + JSON.stringify({ id, value }));
    /** calculate production per hour */
    try {
      const timestamp = new Date(time);
      const lastOperator = new Date(timestamp);
      const firstOperator = new Date(timestamp - 3600 * 1000);
      const lastProduction =
        (
          await axios.get(`${RECORD_ENGINE_URL}/record`, {
            params: {
              entityId: id,
              field: this.production,
              operator: "last",
              unit: "hour",
              from: new Date(lastOperator.setMinutes(0, 0, 0)),
              to: new Date(lastOperator.setMinutes(59, 59, 999)),
            },
          })
        )?.data[0]?.value || value;
      const firstProduction =
        (
          await axios.get(`${RECORD_ENGINE_URL}/record`, {
            params: {
              entityId: id,
              field: this.production,
              operator: "last",
              unit: "hour",
              from: new Date(firstOperator.setMinutes(0, 0, 0)),
              to: new Date(firstOperator.setMinutes(59, 59, 999)),
            },
          })
        )?.data[0]?.value || 0;
      const result = lastProduction - firstProduction;

      await this.#updateOrCreate(
        {
          field: PRODUCTION_HOURLY_NAME,
          timestamp: new Date(timestamp.setMinutes(0, 0, 0)),
        },
        result
      );
    } catch (err) {
      console.error(err);
    }
    /** calculate production per day */
    try {
      const lastOperator = dayjs(time)
        .tz(this?.site?.timeZone || "Africa/Abidjan")
        .hour(23)
        .minute(59)
        .second(59)
        .millisecond(999);
      const firstOperator = dayjs(time)
        .tz(this?.site?.timeZone || "Africa/Abidjan")
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      const lastProduction =
        (
          await axios.get(`${RECORD_ENGINE_URL}/record`, {
            params: {
              entityId: id,
              field: this.production,
              operator: "last",
              unit: "day",
              from: firstOperator.toDate(),
              to: lastOperator.toDate(),
            },
          })
        )?.data[0]?.value || value;
      const firstProduction =
        (
          await axios.get(`${RECORD_ENGINE_URL}/record`, {
            params: {
              entityId: id,
              field: this.production,
              operator: "last",
              unit: "day",
              from: firstOperator.add(-1, "day").toDate(),
              to: lastOperator.add(-1, "day").toDate(),
            },
          })
        )?.data[0]?.value || 0;
      const result = lastProduction - firstProduction;
      await this.#updateOrCreate(
        { field: PRODUCTION_DAILY_NAME, timestamp: firstOperator.toDate() },
        result
      );
    } catch (err) {
      console.error(err);
    }
    /** calculate production per month */
    try {
      const lastOperator = dayjs(time)
        .tz(this?.site?.timeZone || "Africa/Abidjan")
        .hour(23)
        .minute(59)
        .second(59)
        .millisecond(999)
        .date(dayjs(time).daysInMonth());
      const firstOperator = dayjs(time)
        .tz(this?.site?.timeZone || "Africa/Abidjan")
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .date(1);
      const lastProduction =
        (
          await axios.get(`${RECORD_ENGINE_URL}/record`, {
            params: {
              entityId: id,
              field: this.production,
              operator: "last",
              unit: "year",
              from: firstOperator.toDate(),
              to: lastOperator.toDate(),
            },
          })
        )?.data[0]?.value || value;
      const firstProduction =
        (
          await axios.get(`${RECORD_ENGINE_URL}/record`, {
            params: {
              entityId: id,
              field: this.production,
              operator: "last",
              unit: "year",
              from: firstOperator.add(-1, "month").toDate(),
              to: lastOperator.add(-1, "month").toDate(),
            },
          })
        )?.data[0]?.value || 0;

      const result = lastProduction - firstProduction;
      await this.#updateOrCreate(
        { field: PRODUCTION_MONTHLY_NAME, timestamp: firstOperator.toDate() },
        result
      );
    } catch (err) {
      console.error(err);
    }
    /** calculate production per year*/
    try {
      const lastOperator = dayjs(time)
        .tz(this?.site?.timeZone || "Africa/Abidjan")
        .month(11)
        .hour(23)
        .minute(59)
        .second(59)
        .millisecond(999)
        .date(31);
      const firstOperator = dayjs(time)
        .tz(this?.site?.timeZone || "Africa/Abidjan")
        .month(0)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .date(1);

      const lastProduction =
        (
          await axios.get(`${RECORD_ENGINE_URL}/record`, {
            params: {
              entityId: id,
              field: this.production,
              operator: "last",
              unit: "year",
              from: firstOperator.toDate(),
              to: lastOperator.toDate(),
            },
          })
        )?.data[0]?.value || value;
      const firstProduction =
        (
          await axios.get(`${RECORD_ENGINE_URL}/record`, {
            params: {
              entityId: id,
              field: this.production,
              operator: "last",
              unit: "year",
              from: firstOperator.add(-1, "year").toDate(),
              to: lastOperator.add(-1, "year").toDate(),
            },
          })
        )?.data[0]?.value || 0;
      const result = lastProduction - firstProduction;
      await this.#updateOrCreate(
        { field: PRODUCTION_YEARLY_NAME, timestamp: firstOperator.toDate() },
        result
      );
    } catch (err) {
      console.error(err);
    }
  }
  /**
   * update or create new record in database, then send notify to redis pub/sub
   * @param {{field: string, timestamp: Date}} param0
   * @param {number} result
   */
  async #updateOrCreate({ field, timestamp }, result) {
    const entityId = this.id;
    const record = await Recorder.findOne({
      "metadata.timestamp": timestamp,
      "metadata.entityId": entityId,
      "metadata.field": field,
    });
    try {
      if (!record) {
        await Recorder.create({
          timestamp: timestamp,
          metadata: {
            timestamp: timestamp,
            entityId: entityId,
            field: field,
          },
          value: result,
        });
        this.publisher.publish(
          `telemetry.${entityId}.${field}`,
          JSON.stringify({ value: result, timestamp })
        );
      } else {
        if (Math.abs(record.value - result) >= Number.EPSILON) {
          await Recorder.deleteMany({
            "metadata.timestamp": timestamp,
            "metadata.entityId": entityId,
            "metadata.field": field,
          });
          await Recorder.create({
            timestamp: timestamp,
            metadata: {
              timestamp: timestamp,
              entityId: entityId,
              field: field,
            },
            value: result,
          });
          this.publisher.publish(
            `telemetry.${entityId}.${field}`,
            JSON.stringify({ value: result, timestamp })
          );
        }
      }
    } catch (err) {
      throw err;
    }
  }
  /**
   * parse message from JSON to object with timestamp is Date
   * @param {string} message  message in JSON
   * @returns {{value: number,timestamp: Date}}
   */
  #messageParser(message) {
    const { value, timestamp } = JSON.parse(message);
    return { value, timestamp: new Date(timestamp) };
  }
}

class Inverters {
  inverters = [];
  /**
   * init inverters
   * @param {Array.<inverter>} inverters
   * @param {RedisClient} RedisClient
   */
  init(inverters, RedisClients) {
    if (this.inverters.length !== 0) {
      throw new Error("init should be call only once");
    }
    this.RedisClients = RedisClients;
    this.inverters = inverters.map(
      (inverter) => new Inverter(inverter, RedisClients)
    );
  }
  /**
   * add new inverter
   * @param {inverter} inverter
   */
  add(inverter) {
    this.inverters.push(new Inverter(inverter, this.RedisClient));
  }
  /**
   * delete one inverter
   * @param {string} id inverter id
   */
  async delete(id) {
    const inverter = this.inverters.find((e) => e.id === id);
    await inverter.destroy();
    this.inverters.filter((e) => e.id !== id);
  }
}
module.exports = new Inverters();
