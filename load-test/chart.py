import matplotlib.pyplot as plt
import re
import numpy as np
from matplotlib import rc
import statistics

rc('font', family='Apple SD Gothic Neo')

# 파일 경로 설정
file_path = "순차처리X인터벌줄이기.txt"

# 초 데이터를 추출하여 ms로 변환
response_times_ms = []

with open(file_path, "r") as file:
    for line in file:
        match = re.search(r"\((\d+\.\d+) sec\)", line)
        if match:
            seconds = float(match.group(1))  # 초 값을 추출
            response_times_ms.append(seconds)  # ms로 변환

# X축: 요청의 인덱스 (1부터 시작)
request_indices = list(range(1, len(response_times_ms) + 1))
bins = [0.6,0.8,1.0,1.2,1.4,1.6,1.8,2.0,2.2]

counts, _ = np.histogram(response_times_ms, bins=bins)

# 비율 계산
percentages = counts / sum(counts) * 100

print('평균',statistics.mean(response_times_ms))


# 차트 생성
labels = [f"{bins[i]}~{bins[i + 1]}" for i in range(len(bins) - 1)]
plt.bar(labels, percentages, alpha=0.85,width=0.4)
plt.title("쿼리 실행 시간 분포", fontsize=18, fontweight='bold',pad=20)
plt.xlabel("실행 시간 범위 (초)", fontsize=12, labelpad=10)
plt.ylabel("비율 (%)", fontsize=12, labelpad=5)
plt.yticks(range(0, 25, 5))

plt.show()