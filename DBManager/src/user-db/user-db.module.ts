import { Module } from '@nestjs/common';
import { UserSessionDBService } from './user-session-db.service';

@Module({
  providers: [UserSessionDBService],
})
export class UserDBModule {}
