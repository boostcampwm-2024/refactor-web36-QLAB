import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import Redis from 'ioredis';
import { SessionRepository } from '../../src/redis/session.repository';

describe('RedisService', () => {
  let sessionRepository: SessionRepository;
  let redisContainer: StartedRedisContainer;

  beforeAll(async () => {
    redisContainer = await new RedisContainer().withExposedPorts(6379).start();

    const redisConnection = new Redis({
      host: redisContainer.getHost(),
      port: redisContainer.getMappedPort(6379),
      db: 0,
    });

    sessionRepository = new SessionRepository(redisConnection);
  });

  afterEach(() => {
    sessionRepository['sessionConnection'].del('testKey');
  });

  afterAll(async () => {
    sessionRepository['sessionConnection'].disconnect();
    await redisContainer.stop();
  });

  it('세션 저장소에 존재하지 않는 세션 ID의 경우, setNewSession 메서드를 통해 새로운 세션 정보를 등록할 수 있다.', async () => {
    // given
    const newSessionId = 'testKey';

    // when
    // 새로운 세션을 생성한다
    await sessionRepository.setNewSession(newSessionId);

    // then
    // redis에 해당 세션이 등록된다
    const newSession = await sessionRepository.getSession(newSessionId);
    expect(newSession).not.toBeNull();
  });

  it('세션 저장소에 이미 존재하는 세션 ID의 경우, setNewSession 메서드를 통해 새로운 세션 정보를 등록하지 않는다.', async () => {
    // given
    const existingSession = 'testKey';
    await sessionRepository.setNewSession(existingSession);
    const keyCountBefore = sessionRepository['sessionConnection'].get('*');

    // when
    await sessionRepository.setNewSession(existingSession);

    // then
    const keyCountAfter = sessionRepository['sessionConnection'].get('*');
    expect(keyCountAfter).toEqual(keyCountBefore);
  });

  it('getSession 메서드를 통해 Redis에 등록한 세션 정보를 조회할 수 있다.', async () => {
    // given
    const mockKey = 'testKey';
    await sessionRepository.setNewSession(mockKey);

    // when
    const session = await sessionRepository.getSession(mockKey);

    // then
    expect(session).not.toBeNull();
  });
});
