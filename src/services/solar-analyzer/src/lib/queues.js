class Queue {
  id;
  #_object = {};
  #_timer;
  #_fields = [];
  #_callback = () => {};
  #_timeout;
  /**
   *
   * @param {any} id
   * @param {Array.<string>} fields
   * @param {function callback({id: any, queue: object},isTimeout: boolean) {}} callback
   * @param {number =5000} timeout
   */
  constructor(id, fields, callback, timeout = 100) {
    this.id = id;
    this.#_fields = [...fields];
    this.#_callback = callback;
    this.#_timeout = timeout;
  }
  /**
   * add new item to queue
   * @param {{value,field}} item
   */
  add(item) {
    const { value, field } = item;
    if (this.#_fields.some((e) => e === field)) {
      clearTimeout(this.#_timer);
      this.#_object[field] = value;
      const objectFields = Object.keys(this.#_object);

      //queue is full
      if (this.#_fields.every((keys) => objectFields.some((e) => e === keys))) {
        this.#_callback({ id: this.id, queue: this.#_object }, false);
      } else {
        this.#_timer = setTimeout(() => {
          this.#_callback({ id: this.id, queue: this.#_object }, true);
        }, this.#_timeout);
      }
    } else {
      console.error("wrong field detected");
    }
  }
}
class Queues {
  #_fields;
  #_timeout;
  #_callback;
  #_queues = [];
  /**
   *  init new queue
   * @param {Array.<string>} fields
   * @param {function callback({id: any, queue: object},isTimeout: boolean) {}} callback
   * @param {number =5000} timeout
   */
  constructor(fields, callback, timeout) {
    this.#_fields = [...fields];
    this.#_timeout = timeout;
    this.#_callback = ({ id, queue }, isTimeout) => {
      callback({ id, queue }, isTimeout);
      this.#_queues = this.#_queues.filter((item) => item.id !== id);
    };
  }
  /**
   *
   * @param {any} id
   * @param {{value: any, field: string}} item
   */
  add(id, item) {
    let queue = this.#_queues.find((e) => e.id === id);
    if (queue === undefined) {
      queue = new Queue(id, this.#_fields, this.#_callback, this.#_timeout);
      this.#_queues.push(queue);
    }
    queue.add(item);
  }
}
module.exports = Queues;
