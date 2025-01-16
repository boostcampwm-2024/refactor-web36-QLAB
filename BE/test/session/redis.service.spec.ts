import { ConfigService } from '@nestjs/config';
import { mock, MockProxy } from 'jest-mock-extended';
import { RedisService } from '../../src/config/redis/redis.service';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';

describe('RedisService', () => {
  let redisService: RedisService;
  let mockConfigService: MockProxy<ConfigService>;
  let redisContainer: StartedRedisContainer;

  beforeAll(async () => {
    redisContainer = await new RedisContainer().withExposedPorts(6379).start();

    mockConfigService = mock<ConfigService>();
    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'REDIS_HOST':
          return redisContainer.getHost();
        case 'REDIS_PORT':
          return redisContainer.getMappedPort(6379).toString();
      }
    });

    redisService = new RedisService(mockConfigService);
  });

  afterEach(() => {
    redisService['sessionConnection'].del('testKey');
  });

  afterAll(async () => {
    redisService['sessionConnection'].disconnect();
    await redisContainer.stop();
  });

  it('세션 저장소에 존재하지 않는 세션 ID의 경우, setNewSession 메서드를 통해 새로운 세션 정보를 등록할 수 있다.', async () => {
    // given
    const newSessionId = 'testKey';

    // when
    // 새로운 세션을 생성한다
    await redisService.setNewSession(newSessionId);

    // then
    // redis에 해당 세션이 등록된다
    const newSession = await redisService.getSession(newSessionId);
    expect(newSession).not.toBeNull();
  });

  it('세션 저장소에 이미 존재하는 세션 ID의 경우, setNewSession 메서드를 통해 새로운 세션 정보를 등록하지 않는다.', async () => {
    // given
    const existingSession = 'testKey';
    await redisService.setNewSession(existingSession);
    const keyCountBefore = redisService['sessionConnection'].get('*');

    // when
    await redisService.setNewSession(existingSession);

    // then
    const keyCountAfter = redisService['sessionConnection'].get('*');
    expect(keyCountAfter).toEqual(keyCountBefore);
  });

  it('getSession 메서드를 통해 Redis에 등록한 세션 정보를 조회할 수 있다.', async () => {
    // given
    const mockKey = 'testKey';
    await redisService.setNewSession(mockKey);

    // when
    const session = await redisService.getSession(mockKey);

    // then
    expect(session).not.toBeNull();
  });
});
