from locust import HttpUser, task, between
import logging
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class User(HttpUser):
    wait_time = between(5, 10)

    def on_start(self):
        self.shellId = None

        try:
            response = self.client.post("/api/shells")

            if response.status_code == 201:
                self.shellId = response.json().get('data', {}).get('id')
                time.sleep(1)  # 세션 초기화 대기
                self.call_first_query()
            else:
                # 실패: 세션 생성 API가 201이 아닌 상태 코드 반환
                logger.error(f"세션 생성 실패. Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            # 실패: 네트워크 에러, 연결 실패, 타임아웃 등
            logger.error(f"세션 생성 중 에러 발생: {str(e)}")

    def call_first_query(self):
        """세션 생성 직후 첫 쿼리 실행"""
        if not self.shellId:
            return

        try:
            query = "SELECT BENCHMARK(20000000, POW(2, 1));"

            response = self.client.post(
                f"/api/shells/{self.shellId}/execute",
                json={"query": query},
                name="POST /api/shells/{id}/execute (first)"
            )

            if response.status_code >= 400:
                # 실패: 쿼리 실행 API가 4xx/5xx 에러 반환
                logger.error(f"첫 쿼리 실패. Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            # 실패: 네트워크 에러, 연결 실패, 타임아웃 등
            logger.error(f"첫 쿼리 실행 중 에러: {str(e)}")

    @task
    def call_apis(self):
        if not self.shellId:
            # 실패: 세션이 생성되지 않아 shellId가 없음
            logger.warning("shellId가 없어서 태스크 실행을 건너뜁니다")
            return

        try:
            query = "SELECT BENCHMARK(20000000, POW(2, 1));"

            response = self.client.post(
                f"/api/shells/{self.shellId}/execute",
                json={"query": query},
                name="POST /api/shells/{id}/execute"
            )

            if response.status_code < 200 or response.status_code >= 300:
                # 실패: 쿼리 실행 API가 2xx가 아닌 상태 코드 반환
                logger.error(f"쿼리 실행 실패. Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            # 실패: 네트워크 에러, 연결 실패, 타임아웃 등
            logger.error(f"쿼리 실행 중 에러 발생: {str(e)}")
