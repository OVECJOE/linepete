// src/config/message-queue.ts
import amqp from 'amqplib'
import { logger } from '../utils/logger'

interface MessageQueueConfig {
  connectionUrl: string
  exchangeName: string
  queueName: string
}

class MessageQueueService {
  private connection: amqp.Connection | null = null
  private channel: amqp.Channel | null = null
  private config: MessageQueueConfig

  constructor(config: MessageQueueConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.connectionUrl)
      this.channel = await this.connection.createChannel()
      
      await this.channel.assertExchange(this.config.exchangeName, 'topic', {
        durable: true
      })
      
      await this.channel.assertQueue(this.config.queueName, {
        durable: true,
        autoDelete: false
      })

      logger.info('RabbitMQ connection established')
    } catch (error) {
      logger.error('RabbitMQ connection error', error)
      throw error
    }
  }

  async publishMessage(
    routingKey: string, 
    message: Record<string, unknown>
  ): Promise<boolean> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized')
    }

    try {
      return this.channel.publish(
        this.config.exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { 
          persistent: true,
          timestamp: Date.now()
        }
      )
    } catch (error) {
      logger.error('Message publish error', error)
      return false
    }
  }

  async consumeMessages(
    callback: (msg: amqp.ConsumeMessage | null) => void
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized')
    }

    await this.channel.consume(
      this.config.queueName, 
      callback, 
      { noAck: false }
    )
  }
}

export default MessageQueueService