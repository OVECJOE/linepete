import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

class DatabaseConnection {
  private static instance: PrismaClient
  
  private constructor() {}
  
  public static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new PrismaClient({
        log: [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'stdout' },
          { level: 'info', emit: 'stdout' },
          { level: 'warn', emit: 'stdout' }
        ]
      })
      
      DatabaseConnection.instance.$on('query', (e) => {
        logger.debug(`Query: ${e.query}`)
        logger.debug(`Params: ${e.params}`)
        logger.debug(`Duration: ${e.duration}ms`)
      })
    }

    return DatabaseConnection.instance
  }
  
  public static async connect(): Promise<void> {
    try {
      await this.getInstance().$connect()
      logger.info('Database connection established successfully')
    } catch (error) {
      logger.error('Failed to connect to database', error)
      process.exit(1)
    }
  }
  
  public static async disconnect(): Promise<void> {
    await this.getInstance().$disconnect()
  }
}

export default DatabaseConnection