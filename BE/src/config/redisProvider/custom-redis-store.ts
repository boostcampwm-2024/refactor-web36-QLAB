import { SessionData, Store } from 'express-session';
import { SessionRepository } from 'src/middleware/session/session.manager';

export class CustomRedisStore extends Store {
  constructor(private readonly sessionRepository: SessionRepository) {
    super();
  }

  async set(
    sid: string,
    session: SessionData,
    cb: (err?: any) => void,
  ): Promise<void> {
    return cb();
  }

  async get(
    sid: string,
    cb: (err: any, session?: SessionData | null) => void,
  ): Promise<void> {
    try {
      const data = await this.sessionRepository.getSession(sid);
      return cb(data);
    } catch (err) {
      return cb(err);
    }
  }

  async destroy(sid: string, cb: (err?: any) => void): Promise<void> {
    try {
      return cb();
    } catch (err) {
      cb(err);
    }
  }
}
