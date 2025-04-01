import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import Redis from 'ioredis';
import { SessionRepository } from '../../src/session/session.manager';

describe('SessionRepository', () => {
  let sessionManager: SessionRepository;
  let redis: Redis;
  let redisContainer: StartedRedisContainer;

  beforeAll(async () => {
    redisContainer = await new RedisContainer().withExposedPorts(6379).start();

    redis = new Redis({
      host: redisContainer.getHost(),
      port: redisContainer.getMappedPort(6379),
      db: 0,
    });

    sessionManager = new SessionRepository(redis);
  });

  beforeEach(async () => {
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
    await redisContainer.stop();
  });

  it('세션 저장소에 존재하지 않는 세션 ID의 경우, setNewSession 메서드를 통해 새로운 세션 정보를 등록할 수 있다.', async () => {
    // given
    const newSessionId = 'testKey';

    // when
    // 새로운 세션을 생성한다
    await sessionManager.setSession(newSessionId);

    // then
    // redis에 해당 세션이 등록된다
    const newSession = await sessionManager.getSession(newSessionId);
    expect(newSession).not.toBeNull();
  });

  it('세션 저장소에 이미 존재하는 세션 ID의 경우, setNewSession 메서드를 통해 새로운 세션 정보를 등록하지 않는다.', async () => {
    // given
    const existingSession = 'testKey';
    await sessionManager.setSession(existingSession);
    const keyCountBefore = await redis.keys('*');

    // when
    await sessionManager.setSession(existingSession);

    // then
    const keyCountAfter = await redis.keys('*');
    expect(keyCountAfter).toEqual(keyCountBefore);
  });

  it('getSession 메서드를 통해 Redis에 등록한 세션 정보를 조회할 수 있다.', async () => {
    // given
    const mockKey = 'testKey';
    await sessionManager.setSession(mockKey);

    // when
    const session = await sessionManager.getSession(mockKey);

    // then
    expect(session).not.toBeNull();
  });
});
