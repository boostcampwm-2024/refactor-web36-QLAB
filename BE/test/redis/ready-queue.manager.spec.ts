import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import Redis from 'ioredis';
import { ReadyQueueManager } from '../../src/redis/ready-queue.manager';

describe('ReadyQueueManager', () => {
  let redisContainer: StartedRedisContainer;
  let redis: Redis;
  let readyQueueManager: ReadyQueueManager;

  beforeAll(async () => {
    redisContainer = await new RedisContainer().withExposedPorts(6379).start();

    redis = new Redis({
      host: redisContainer.getHost(),
      port: redisContainer.getMappedPort(6379),
      db: 3,
    });

    readyQueueManager = new ReadyQueueManager(redis);
  });

  beforeEach(async () => {
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
    await redisContainer.stop();
  });

  it('요청을 넣으면 queue에 추가된다.', async () => {
    // Given
    const requestId = 'request-id';
    const sessionId = 'test-session';

    // When
    await readyQueueManager.enqueue(requestId, sessionId);

    // Then
    const keys = await redis.zrange(sessionId, 0, -1);
    expect(keys).toHaveLength(1);
  });

  it('큐에 생성된 이벤트를 삭제할 수 있다..', async () => {
    // Given
    const requestId = 'request-id-1';
    const sessionId = 'test-session';

    // When
    await readyQueueManager.enqueue(requestId, sessionId);
    await readyQueueManager.dequeue(requestId, sessionId);

    // Then
    const keys = await redis.zrange(sessionId, 0, -1);
    expect(keys).toHaveLength(0);
  });

  it('이전 요청이 처리되지 않으면 신규 요청은 대기해야 한다.', async () => {
    // Given
    const requestId = ['request-id-1', 'request-id-2'];
    const sessionId = 'test-session';

    // When
    await readyQueueManager.enqueue(requestId[0], sessionId);
    await readyQueueManager.enqueue(requestId[1], sessionId);
    const isFinished = readyQueueManager.waitForPriority(
      requestId[1],
      sessionId,
    );

    // Then
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('이전 요청이 처리되지 않아 대기상태입니다.')),
        500,
      );
    });

    await expect(Promise.race([isFinished, timeoutPromise])).rejects.toThrow(
      '이전 요청이 처리되지 않아 대기상태입니다.',
    );
  });

  it('다른 세션에 대해서는 독립적이므로 대기하지 않아도 된다.', async () => {
    // Given
    const requestId = 'request-id';
    const sessionId = ['test-session-1', 'test-session-2'];

    // When
    await readyQueueManager.enqueue(requestId, sessionId[0]);
    await readyQueueManager.enqueue(requestId, sessionId[1]);
    const isProcessed = readyQueueManager.waitForPriority(
      requestId,
      sessionId[1],
    );

    // Then
    await expect(isProcessed).resolves.toBe(true);
  });

  it('polling 방식으로 큐를 확인하므로 요청은 인터벌에 따라 처리된다.', async () => {
    // Given
    const requestId = ['request-id-1', 'request-id-2'];
    const sessionId = 'test-session';

    // When
    await readyQueueManager.enqueue(requestId[0], sessionId);
    await readyQueueManager.enqueue(requestId[1], sessionId);
    const isFinished = readyQueueManager.waitForPriority(
      requestId[1],
      sessionId,
    );
    readyQueueManager.dequeue(requestId[0], sessionId);

    // Then
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('이전 요청이 처리되지 않아 대기상태입니다.')),
        100,
      );
    });
    const timeoutPromise2 = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('이전 요청이 처리되지 않아 대기상태입니다.')),
        1000,
      );
    });

    await expect(Promise.race([isFinished, timeoutPromise])).rejects.toThrow(
      '이전 요청이 처리되지 않아 대기상태입니다.',
    );
    await expect(Promise.race([isFinished, timeoutPromise2])).resolves.toBe(
      true,
    );
  });
});
