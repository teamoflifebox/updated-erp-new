class WhatsAppService {
  constructor() {
    this.notifications = [];
  }

  async sendNotification(message, recipient) {
    // Mock implementation
    console.log(`Sending WhatsApp notification to ${recipient}: ${message}`);
    
    this.notifications.push({
      message,
      recipient,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });

    return { success: true, messageId: Date.now().toString() };
  }

  async getNotifications() {
    return this.notifications;
  }
}

module.exports = new WhatsAppService();