// config/kafkaConfig.ts
import { KafkaConfig } from 'kafkajs';
import fs from 'fs';

function getKafkaConfig(): KafkaConfig {
  const brokers = process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(',')
    : ['localhost:9092'];

  const sslEnabled = process.env.KAFKA_SSL === 'true';
  let sslConfig: KafkaConfig['ssl'] = undefined;

  if (sslEnabled) {
    sslConfig = {};
    if (process.env.KAFKA_SSL_CA_FILE) {
      try {
        const ca = fs.readFileSync(process.env.KAFKA_SSL_CA_FILE, 'utf-8');
        sslConfig = { ca: [ca] };
      } catch (error) {
        console.error('Failed to read SSL CA file:', error);
      }
    }
  }

  const username = process.env.KAFKA_USERNAME;
  const password = process.env.KAFKA_PASSWORD;
  const mechanismRaw =
    (process.env.KAFKA_SASL_MECHANISM as KafkaConfig['sasl'] extends { mechanism: infer M } ? M : any) ||
    'scram-sha-256';
  const mechanism = typeof mechanismRaw === 'string' ? mechanismRaw.toLowerCase() : mechanismRaw;

  return {
    clientId: 'zomato-lite',
    brokers,
    ssl: sslConfig,
    sasl: username && password ? { mechanism: mechanism as any, username, password } : undefined,
    connectionTimeout: 30000,
    authenticationTimeout: 30000,
    retry: {
      initialRetryTime: 100,
      retries: 8
    }
  };
}

export default getKafkaConfig
