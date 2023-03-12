const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

export const DEFAULT_RABBITMQ_CONFIG = {
  // Connect to the test database when, well, testing
  noAck: false, // To make sure a message is never lost, we will turn on ack field.
  queueOptions: {
    durable: false
  },
};
