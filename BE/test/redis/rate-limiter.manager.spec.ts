import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import Redis from 'ioredis';
import { RateLimiterManager } from '../../src/rate-limiter/rate-limiter.manager';

describe('ReadyQueueManager', () => {
  let redisContainer: StartedRedisContainer;
  let redis: Redis;
  let rateLimiterManager: RateLimiterManager;

  beforeAll(async () => {
    redisContainer = await new RedisContainer().withExposedPorts(6379).start();

    redis = new Redis({
      host: redisContainer.getHost(),
      port: redisContainer.getMappedPort(6379),
      db: 4,
    });

    rateLimiterManager = new RateLimiterManager(redis);
  });

  beforeEach(async () => {
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
    await redisContainer.stop();
  });

  it('응답시간을 추가할 수 있다.', async () => {
    // Given
    const requestTime = Date.now();
    const sessionId = 'test-session';
    const responseTime = 1;

    // When
    await rateLimiterManager.addResponseTime(requestTime,sessionId, responseTime);

    // Then
    const count = await redis.zcount(sessionId, '-inf', '+inf');
    expect(count).toBe(1);
  });

  it('세션별로 응답시간을 공유하지 않는다.', async () => {
    // Given
    const requestTime = Date.now();
    const sessionId1 = 'test-session1';
    const sessionId2 = 'test-session1';
    const responseTime = 1;

    // When
    await rateLimiterManager.addResponseTime(
      requestTime,
      sessionId1,
      responseTime,
    );
    await rateLimiterManager.addResponseTime(
      requestTime,
      sessionId2,
      responseTime,
    );

    // Then
    const session1count = await redis.zcount(sessionId1, '-inf', '+inf');
    const session2count = await redis.zcount(sessionId2, '-inf', '+inf');
    expect(session1count).toBe(1);
    expect(session2count).toBe(1);
  });

  it('남은 응답시간을 반환할 수 있다.', async () => {
    // Given
    const sessionId = 'test-session';
    const responseTime = 1;
    const requestTime = Date.now();
    await redis.zadd(sessionId, requestTime, responseTime);

    // When
    const remainTime = await rateLimiterManager.getRemainTime(sessionId);

    // Then
    expect(remainTime).toBe(19);
  });

  it('60초가 지난 응답시간은 삭제된다.', async () => {
    // Given
    const sessionId = 'test-session';
    const responseTime = 1;
    const beforeRequestTime = Date.now() - 60 * 1000;
    await redis.zadd(sessionId, beforeRequestTime, responseTime);

    // When
    const remainTime = await rateLimiterManager.getRemainTime(sessionId);

    // Then
    expect(remainTime).toBe(20);
  });
});
