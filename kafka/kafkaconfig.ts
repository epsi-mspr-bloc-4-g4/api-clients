import { Kafka } from "kafkajs";
import * as dotevnv from "dotenv";

dotevnv.config();

export const kafka = new Kafka({
  clientId: "Client",
  brokers: [process.env.KAFKA_SERVER as string],
});

export const consumer = kafka.consumer({ groupId: "clientsGroup" });
export const producer = kafka.producer();
