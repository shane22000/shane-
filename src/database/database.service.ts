import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  pool!: mysql.Pool;

  getPool(): mysql.Pool {
    if (!this.pool) {
      throw new Error('Database pool is not initialized');
    }

    return this.pool;
  }

  async onModuleInit() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'mysql',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'online_food_ordering_system',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    try {
      await this.pool.query('SELECT 1');
      console.log('MySQL Database Connected!');
    } catch (error) {
      console.error('MySQL connection failed:', error instanceof Error ? error.message : error);
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}