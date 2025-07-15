export const config = {
  // WhatsApp Configuration
  whatsapp: {
    apiToken: import.meta.env.VITE_WHATSAPP_API_TOKEN || '',
    phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
    webhookVerifyToken: import.meta.env.VITE_WHATSAPP_WEBHOOK_VERIFY_TOKEN || '',
    apiUrl: import.meta.env.VITE_WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0',
  },
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
  },
  
  // Real-time Configuration
  socket: {
    url: import.meta.env.VITE_SOCKET_URL || '/',
    options: {
      transports: ['websocket'],
      upgrade: true,
    },
  },
  
  // Database Configuration
  database: {
    url: import.meta.env.VITE_DATABASE_URL || '',
  },
  
  // SMS Backup Configuration
  sms: {
    apiKey: import.meta.env.VITE_SMS_API_KEY || '',
    senderId: import.meta.env.VITE_SMS_SENDER_ID || 'OXFORD',
  },
  
  // Environment
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  isProduction: import.meta.env.VITE_NODE_ENV === 'production',
};