class AnalyticsService {
  constructor() {
    this.data = [];
  }

  async getAnalytics() {
    return this.data;
  }

  async addAnalytics(data) {
    this.data.push({
      ...data,
      timestamp: new Date().toISOString()
    });
    return true;
  }
}

module.exports = new AnalyticsService();