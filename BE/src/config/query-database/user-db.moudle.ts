import { Module } from '@nestjs/common';
import { UserDBManager } from './user-db-manager.service';

@Module({
  providers: [UserDBManager],
  exports: [UserDBManager],
})
export class UserDBModule {}
