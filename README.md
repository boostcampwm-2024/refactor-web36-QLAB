# Web36-QLab

<p align="center">
  <img alt="메인 베너" src="https://github.com/user-attachments/assets/d5035970-1271-4989-8894-676bc9c40971">
</p>

<br>

<p align="center">
  <a href="https://www.figma.com/design/HrkHyatNVUWIYhraMrAe7K/Q-Lab-Figma?node-id=0-1&node-type=canvas&t=cqtexfcbQGGHaNiE-0">
    <img src="https://github.com/user-attachments/assets/9513a6ed-d7c2-4473-a3de-e962cda661a0" alt="Group 5" width="200" style="margin-right: 20px;"/>
  </a>
  <a href="https://spiffy-centipede-875.notion.site/Q-Lab-13062570e7c4800289aedbd54ddd23b1?pvs=4">
    <img src="https://github.com/user-attachments/assets/47cae543-4cca-4298-9231-57f1119108ea" alt="Group 6" width="200" style="margin-right: 20px;"/>
  </a>
  <a href="https://docs.google.com/spreadsheets/d/1nS4Tt7UpcixYkp1yjo8RCPS8zYcq20dWPrLYSbetenk/edit?usp=sharing">
    <img src="https://github.com/user-attachments/assets/7473ba79-e838-450b-aadc-b9bcfbdc87c0" alt="Group 4" width="200"/>
  </a>
  <a href="[https://docs.google.com/spreadsheets/d/1nS4Tt7UpcixYkp1yjo8RCPS8zYcq20dWPrLYSbetenk/edit?usp=sharing](http://223.130.155.9)">
    <img src="https://github.com/user-attachments/assets/8c39c3f7-4d85-4707-8e45-c4e5d1d9e2d0" alt="Group 8" width="200"/>
  </a>
</p>

<br>

# 문제의식
```
쉽고 빠르게 쿼리를 연습할 수 없을까? 🤔
Query를 연습하고 싶은데, DB 환경세팅이 너무 어렵고 많은 시간이 소요되네...
```
- 조건에 맞는 300만건의 데이터는 어떻게 생성하지? (복잡한 프로시저 작성, js코드 구현하여 작업)
- 쿼리만 빠르게 실행하고 싶은데 복잡한 DB 환경세팅에 너무 많은 시간이 소요됨
- 이전에 실행한 쿼리들의 시간을 비교하는게 어려움
<br>
<br>

## 핵심 기능

### 환경세팅 없이 빠르고 편하게 쿼리를 실행해보세요.
> 클라우드 상에서 사용자에게 DB 환경을 제공하고 관리해요.
- 쉘 단위로 쿼리를 작성하고 실행해서 결과를 볼 수 있어요.
- 생성된 테이블은 우측 창에서 정보를 실시간으로 확인할 수 있어요.

![쿼리 실행 : 테이블 보기](https://github.com/user-attachments/assets/1c87bdfb-ecf9-43c6-84b5-28cd6365393b)

[유저의 쿼리 실행 환경은 어떻게 제공되나요?](https://github.com/boostcampwm-2024/refactor-web36-QLab/wiki/%EC%82%AC%EC%9A%A9%EC%9E%90%EC%9D%98-%EC%BF%BC%EB%A6%AC-%EC%8B%A4%ED%96%89%ED%99%98%EA%B2%BD%EC%9D%80-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%A0%9C%EA%B3%B5%EB%90%98%EB%82%98%EC%9A%94%3F)

> 세션을 이용하여 DB Connection 관리하는 법  
> 실제 쿼리 실행 시간 측정 방법


<br>
<br>

### 테이블 생성/수정 쿼리를 간편하게 만들어보세요.
> 테이블을 GUI를 통해 조작해 손쉽게 테이블 생성/수정 쿼리를 만들 수 있어요.

![테이블 생성 수정 쿼리 만들기](https://github.com/user-attachments/assets/c18e9631-90a1-4295-b32c-c0a74eadcfff)


<br>
<br>

### 랜덤 레코드를 쉽게 추가해보세요.
> 레코드 조건을 설정하면, 해당 설정에 맞는 대량의 레코드를 간편하게 추가할 수 있어요.

![랜덤 데이터 추가](https://github.com/user-attachments/assets/219b7fe9-6daa-45e1-b493-2fa53be9411a)

[대용량 랜덤 데이터는 어떻게 삽입되나요?](https://github.com/boostcampwm-2024/refactor-web36-QLAB/wiki/%EB%8C%80%EC%9A%A9%EB%9F%89-%EB%9E%9C%EB%8D%A4-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%82%BD%EC%9E%85%EB%90%98%EB%82%98%EC%9A%94%3F)

> 대용량 데이터를 효율적으로 삽입하는 법    

[유저의 과도한 데이터 삽입은 어떻게 제어하나요?](https://github.com/boostcampwm-2024/refactor-web36-QLab/wiki/%EC%9C%A0%EC%A0%80%EC%9D%98-%EA%B3%BC%EB%8F%84%ED%9E%8C-%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%82%BD%EC%9E%85%EC%9D%80-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%A0%9C%ED%95%9C%EC%8B%9C%ED%82%A4%EB%82%98%EC%9A%94%3F)

> 한정된 스토리지 속 유저 데이터 관리 방법  
> Redis pub/sub 이용하기

<br>
<br>

### 예시 쿼리를 추가할 수 있어요.
> 쿼리를 잘 몰라도, 간편하게 예시 쿼리를 추가할 수 있어요.

![예시 쿼리 넣기](https://github.com/user-attachments/assets/2c1a2eae-fec5-4e17-ac07-3ada90800044)


<br>
<br>

## 핵심 경험

### 점멸하는 쉘
> 부모에서 포커스 상태를 관리하자 자식 컴포넌트 전체가 리렌더링되어 깜빡이는 현상 발생  
> [상태는 대체 어디에…](https://github.com/boostcampwm-2024/web36-QLab/wiki/%EC%83%81%ED%83%9C%EB%8A%94-%EB%8C%80%EC%B2%B4-%EC%96%B4%EB%94%94%EC%97%90%E2%80%A6)

### 유저 DB 커넥션은 어디서 관리할까?

유저 DB에 쿼리를 실행해야 하는 경우는 단순히 유저가 직접 쿼리를 실행하는 상황뿐만 아니라, 다양한 경우에 발생합니다.  
유저의 현재 테이블 정보를 조회하거나, 사용량을 확인하거나, 랜덤 데이터를 삽입하는 경우가 이에 해당합니다.  
이러한 요청에 따라 효율적으로 커넥션을 관리하기 위해 우리는 코드적으로 어떤 개선을 도입했을까요?

[인터셉터로 관심사 분리하기](https://github.com/boostcampwm-2024/refactor-web36-QLAB/wiki/%EC%9D%B8%ED%84%B0%EC%85%89%ED%84%B0%EB%A1%9C-%EA%B4%80%EC%8B%AC%EC%82%AC-%EB%B6%84%EB%A6%AC%ED%95%98%EA%B8%B0)

> 인터셉터의 특징을 활용하여 코드 개선하기

### 통합테스트 코드 작성기

서비스의 핵심 요소인 유저 DB 환경 제공은 단위 테스트만으로는 검증에 한계가 있었습니다.   
이를 보완하기 위해 통합테스트를 도입했으며, 어떤 고민을 하였을까요? 

[jest로 도전한 NestJS 인터셉터 통합테스트](https://github.com/boostcampwm-2024/refactor-web36-QLAB/wiki/jest%EB%A1%9C-%EB%8F%84%EC%A0%84%ED%95%9C-NestJS-%EC%9D%B8%ED%84%B0%EC%85%89%ED%84%B0-%ED%86%B5%ED%95%A9%ED%85%8C%EC%8A%A4%ED%8A%B8)

> test container을 통한 통합테스트 도전  
> 가치있는 테스트 코드를 작성하기 위한 고민

### 확장 가능한 서비스로

동시 사용자수가 많아질수록 유저의 쿼리 실행이 급격히 늘어나는 것을 막을 수는 없었습니다.       
이를 해결하고자 쿠버네티스를 이용하여 서버를 확장하고 로드밸런싱을 하였습니다.   
어떤 방식으로 유연하게 확장 가능한 서비스를 구상하였을까요?

[유저 분산을 위한 로드밸런서 도입기](https://github.com/boostcampwm-2024/refactor-web36-QLAB/wiki/%EC%9C%A0%EC%A0%80-%EB%B6%84%EC%82%B0%EC%9D%84-%EC%9C%84%ED%95%9C-%EB%A1%9C%EB%93%9C%EB%B0%B8%EB%9F%B0%EC%84%9C-%EB%8F%84%EC%9E%85%EA%B8%B0)

> 로드밸런싱 기준 판단하기    
> 배포환경에서도 서버 확장할 수 있도록 구성하기

### 리소스 독점 방지

여러 사용자가 같은 DB 서버를 공유하고 있습니다.
만약 한 사용자가 서버 리소스를 독점한다면 다른 사용자는 큰 피해를 보게됩니다.          
이를 어떻게 제어했을까요?    

[사용자별 쿼리 실행 요청 제한](https://github.com/boostcampwm-2024/refactor-web36-QLAB/wiki/%EC%82%AC%EC%9A%A9%EC%9E%90%EB%B3%84-%EC%BF%BC%EB%A6%AC-%EC%8B%A4%ED%96%89-%EC%9A%94%EC%B2%AD-%EC%A0%9C%ED%95%9C)

> Rate Limiter    
> Redis

## 기술 스택

| **분류**        | **기술 스택**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **공통**         | <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/> <img src="https://img.shields.io/badge/Zod-3178C6?style=flat-square&logo=Zod&logoColor=white"/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **프론트 엔드**  | <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=Tailwind CSS&logoColor=white"/> <img src="https://img.shields.io/badge/React%20Query-FF4154?style=flat-square&logo=React%20Query&logoColor=white"/> <br> <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white"/> <img src="https://img.shields.io/badge/Shadcdn-FF6F61?style=flat-square&logo=Cloudflare&logoColor=white"/>                                                                                                                                                                                      |
| **백엔드**       | <img src="https://img.shields.io/badge/Nest.js-E0234E?style=flat-square&logo=NestJS&logoColor=white"/> <img src="https://img.shields.io/badge/TypeORM-FF5847?style=flat-square&logo=TypeORM&logoColor=white"/> <img src="https://img.shields.io/badge/Jenkins-D24939?style=flat-square&logo=Jenkins&logoColor=white"/> <br> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white"/> <img src="https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=Swagger&logoColor=white"/> |
| **인프라** | <img src="https://img.shields.io/badge/NCloud-03C75A?style=flat-square&logo=Naver&logoColor=white"/> <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=Kubernetes&logoColor=white"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white"/> <img src="https://img.shields.io/badge/Github-181717?style=flat-square&logo=Github&logoColor=white"/>|


<br>
<br>

## 아키텍처 구조
<img width="1600" alt="QLab architecture" src="https://github.com/user-attachments/assets/0c0d21af-73e4-4f5b-87b8-6d56a21c583f">


<br>
<br>

## 팀원소개 (Query Squard)

<div align="center">

| <img src="https://github.com/user-attachments/assets/60c981a9-26ca-4cf0-b812-968a8608ed92" width="150"> | <img src="https://github.com/user-attachments/assets/23b7d31f-6a21-4f48-9c95-8141f3a4d293" width="150"> | <img src="https://github.com/user-attachments/assets/320144f5-b71c-481c-8932-f0ab1fc94a42" width="150"> | <img src="https://github.com/user-attachments/assets/f591796d-d210-4069-b8df-b4d73314519d" width="150"> |
| :---: | :---: | :---: | :---: |
| [J027\_김다영](https://www.notion.so/J027_-f94bbd9fb8ce41119334d5b7229690b2?pvs=21) | [J157\_오민택](https://www.notion.so/J157_-5e9746aa49cd4095967ff44a73cebf48?pvs=21) | [J214\_장승훈](https://www.notion.so/J214_-955d4d79a2c84f17a51a38907bdf4b99?pvs=21) | [J136\_성유진](https://www.notion.so/J136_-5fa4cdd0695046bbb972d4c0d10d65c6?pvs=21) |
| FE | BE | BE | BE |

</div>

<br>
<br>

## 문서

프로젝트를 구현하기 위해 했던 자세한 경험과 구현과정은 [WIKI](https://github.com/boostcampwm-2024/refactor-web36-QLAB/wiki)  에서 확인할 수 있습니다.

