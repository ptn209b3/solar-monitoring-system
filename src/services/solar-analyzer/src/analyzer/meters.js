/**
 * module config const
 */
const PRODUCTION_HOURLY_NAME = "EHour";
const PRODUCTION_DAILY_NAME = "EDay";
const PRODUCTION_MONTHLY_NAME = "EMonth";
const PRODUCTION_YEARLY_NAME = "EYear";

const debugProduction = require("debug")("meter:production");

class Meter {
  constructor(meter, RedisClients) {
    //init meter properties
    this.id = meter.id;
    this.production = meter.production;
    this.site = inverter.site;

    //init Redis clients
    this.subscriber = RedisClients.subscriber;
    this.publisher = RedisClients.publisher;

    this.subscriber.subscribe(
      `telemetry.${this.id}.${this.production}`,
      (message, channel) => {
        this.#handleProductionChange(this.#messageParser(message));
      }
    );
  }
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
   * update or create new record in database, then send notify to redis pubsub
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
   *
   * @param {string} message  message in JSON
   * @returns {{value: number,timestamp: Date}}
   */
  #messageParser(message) {
    const { value, timestamp } = JSON.parse(message);
    return { value, timestamp: new Date(timestamp) };
  }
}

class Meters {
  meters = [];
  /**
   * init meters
   * @param {Array.<inverter>} inverters
   * @param {RedisClient} RedisClient
   * @param {boolean} debug enable debug mode, debug will auto enable in dev mode
   */
  init(meters, RedisClients, debug) {
    if (this.meters.length !== 0) {
      throw new Error("init should be call only once");
    }
    this.RedisClients = RedisClients;
    this.meters = meters.map((meter) => new Meter(meter, RedisClients));
  }
  add(meter) {
    this.meters.push(new Meter(meter, this.RedisClient));
  }
  async delete(id) {
    const meter = this.meters.find((e) => e.id === id);
    await meter.destroy();
    this.meters.filter((e) => e.id !== id);
  }
}

module.exports = new Meters();
