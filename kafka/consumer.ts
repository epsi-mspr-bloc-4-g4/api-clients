import { consumer } from './kafkaconfig';

interface KafkaMessage {
  topic: string;
  partition: number;
  offset: string;
  value: string;
}

let isRunning = false;
let messages: KafkaMessage[] = [];

export const consumeMessages = async (topic: string): Promise<KafkaMessage[]> => {
  if (isRunning) {
    console.log('Consumer is already running');
    console.log('messages :: ', messages);
    return messages;
  }

  await consumer.connect();
  await consumer.subscribe({ topic });

  console.log('START?');
  isRunning = true;
  messages = []; // Reset messages for each new consumption

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      messages.push({
        topic: topic,
        partition: partition,
        offset: message.offset,
        value: message.value?.toString() || '',
      });
    },
  });

  // Wait for messages to be consumed
  await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds

  console.log('END?');
  console.log('messages :: ', messages);

  return messages;
};
