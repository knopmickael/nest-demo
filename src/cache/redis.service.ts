import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis {
  constructor() {
    super();

    super.on('error', (err) => {
      console.error('Redis error:', err);
    });

    super.on('connect', () => {
      console.log('Connected to Redis');
    });
  }
}
