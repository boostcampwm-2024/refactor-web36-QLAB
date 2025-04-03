import { Module } from '@nestjs/common';
import { UserDBManager } from './user-db.manager';
import { SessionModule } from '../../middleware/session/session.module';

@Module({
  imports: [SessionModule],
  providers: [UserDBManager],
  exports: [UserDBManager],
})
export class UserDBModule {}
