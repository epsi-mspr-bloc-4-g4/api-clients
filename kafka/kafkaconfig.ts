import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [process.env.KAFKA_SERVER as string],
});

export const consumer = kafka.consumer({ groupId: 'test-group' });
export const producer = kafka.producer();