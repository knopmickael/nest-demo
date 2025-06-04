import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DbModule } from 'src/db/db.module';
import { UserController } from './user.controller';
import { CacheModule } from 'src/cache/cache.module';

@Module({
    imports: [DbModule, CacheModule],
    controllers: [UserController],
    providers: [UserRepository],
    exports: [UserRepository],
})
export class UserModule {}
