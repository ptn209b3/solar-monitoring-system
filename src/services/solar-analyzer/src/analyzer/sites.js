class Sites {
  sites = [];
  /**
   * init sites
   * @param {Array.<inverter>} inverters
   * @param {RedisClient} RedisClient
   * @param {boolean} debug enable debug mode, debug will auto enable in dev mode
   */
  init(sites, RedisClients, debug) {
    if (this.sites.length !== 0) {
      throw new Error("init should be call only once");
    }
    this.RedisClients = RedisClients;
    this.sites = sites.map((site) => new Meter(site, RedisClients));
  }
  add(site) {
    this.sites.push(new Meter(site, this.RedisClient));
  }
  async delete(id) {
    const site = this.sites.find((e) => e.id === id);
    await site.destroy();
    this.sites.filter((e) => e.id !== id);
  }
}
module.exports = new Sites();
