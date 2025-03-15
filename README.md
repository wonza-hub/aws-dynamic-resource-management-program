<div align="center">
<!-- <img src="https://github.com/user-attachments/assets/ca2219a0-73f3-4eee-bd4c-47b2d178e1f9" width="180px"/> -->
</div>

<div align="center">
<h2>
AWS 동적 자원 관리 프로그램
</h2>
<h5>
클라우드 컴퓨팅 교과목 수행 개인 프로젝트
</h5>
<a href="https://velog.io/@one1_programmer/AWS-AWS-SDK%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%98%EC%97%AC-%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4-%EA%B4%80%EB%A6%AC-%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EA%B8%B0-feat.-AWS-SDK-JavaScript-v3">관련 블로그 글</a>
<br />
<small>
2024.11~2024.12
</small>
</div>

###### 개발 배경

실습 과정 중 가상머신 상에 진행했던 클러스터 구축은 상당한 수작업을 요구했습니다. 이에 인스턴스를 클라우드 상에 배포하고 SDK를 사용하여 GUI로 편리하게 클러스터를 관리하고자 했습니다.

###### 사용 기술

<div>
<img src="https://img.shields.io/badge/Aws-E34F26?style=for-the-badge&logo=AWS&logoColor=white">
</div>

###### 시작 가이드

- **프로젝트 폴더 구성**
    
    ```bash
    ├───node_modules
    ├───public
    │   ├───css
    │   └───js
    ├───src
    │   ├───config # aws 관련 설정 파일
    │   ├───controller # 컨트롤러
    │   ├───routes # 라우터
    │   ├───service # 서비스
    │   │   └───ec2
    │   └───utils # 기타 함수
    └───views
        └───ec2 # 뷰
    ```
    
- **프라이빗 키 삽입**
    
    이후 sdk를 사용하여 인스턴스에 ssh로 접속하기 위해서는 프라이빗 키가 필요하다. 따라서 프로젝트 루트에 본인의 aws 프라이빗 키(.pem)를 위치시킨다. (이는 `.gitignore` 에 포함되므로 깃허브에 본인의 키가 올라갈 일은 없다.)
    
- **의존성 설치**
    
    ```bash
    npm install # 의존성 설치
    npm run dev # 실행
    ```
    
- **환경변수**
    
    AWS SDK를 사용하려면 AWS 리전정보, 액세스 키 정보가 필수적이다. 이를 위해 `.env.example` 을 참고하여 `.env` 를 채워넣도록 한다.
    
    ```yaml
    # .env.example
    AWS_REGION= # AWS 리전
    AWS_ACCESS_KEY_ID= # AWS 액세스 키
    AWS_SECRET_ACCESS_KEY= # AWS 비밀 액세스 키
    PORT= # 서버 실행 포트
    HTCONDOR_TAG_KEY=Name # HTCondor 클러스터 태그 키
    HTCONDOR_TAG_PREFIX=HTCondor_Data # HTCondor 클러스터 태그명 접두사
    HTCondor_SG_ID=sg-xxxx # HTCondor 클러스터가 속한 보안그룹
    ```

---
### 아키텍쳐
![](https://velog.velcdn.com/images/one1_programmer/post/37d4a1d5-f074-4987-a053-59467d9c4b72/image.png)

### API
![](https://velog.velcdn.com/images/one1_programmer/post/f860a5eb-86e1-488d-9db5-e74c7581c7f9/image.png)


### ✨ 주요 기능

#### 인스턴스 생성/시작/중지/재시작

![](https://velog.velcdn.com/images/one1_programmer/post/2ae9c98e-9130-43f8-8e67-ae6a07951244/image.png)
![](https://velog.velcdn.com/images/one1_programmer/post/cb9245d1-7fe8-44b3-bd8b-7f7c5a8c651f/image.png)


#### 클러스터 조회

- **컨트롤 노드 공인 IP 입력**
![](https://velog.velcdn.com/images/one1_programmer/post/d63bffc6-6f2c-43d7-8a1c-43c0790e9ed8/image.png)

    
- **대시보드 확인**
![](https://velog.velcdn.com/images/one1_programmer/post/2f59dab0-4e43-4cb1-9e37-afb5e4d52e14/image.png)

    
- `start` 시 `condor_status` 확인
![](https://velog.velcdn.com/images/one1_programmer/post/00acee30-8551-47b9-8b54-52d5fbe9cb02/image.png)

    
- `stop` 시 `condor_status` 확인 (생략)
    
    
- `create` 시 `condor_status` 확인
![](https://velog.velcdn.com/images/one1_programmer/post/697223f0-cf1c-4df3-9f1b-021820540f2c/image.png)

#### Auto Scaling Group 및 조정 정책 생성

![](https://velog.velcdn.com/images/one1_programmer/post/84d84d75-f7c0-4c50-bd96-b8171bc6b4f6/image.png)
![](https://velog.velcdn.com/images/one1_programmer/post/f37d22a9-b549-473f-a0c6-7ecbd38d116e/image.png)    
    

### Cloud Watch

- **경보 생성**    
![](https://velog.velcdn.com/images/one1_programmer/post/9510200b-cc98-4237-92a2-c65ba89b2346/image.png)


- **작업 제출/큐 상태 확인**
  ![](https://velog.velcdn.com/images/one1_programmer/post/f1d318c4-d076-4464-9f23-c4d1a42ae1dc/image.png)
  ![](https://velog.velcdn.com/images/one1_programmer/post/73189679-ed2f-4bb5-a4aa-90b59336d563/image.png)

    
- **CPU 메트릭 확인**
![](https://velog.velcdn.com/images/one1_programmer/post/e885e0a2-6a37-49ce-acf7-93aa095696fb/image.png)

  > **AWS 콘솔에서 확인**
  > ![](https://velog.velcdn.com/images/one1_programmer/post/bad4db7b-eb59-4f74-9f68-84fc84c378d4/image.png)
- **메일 수신 확인**
![](https://velog.velcdn.com/images/one1_programmer/post/4acb87c5-2f24-4575-898e-9e1fd0695bf7/image.png)


# 🤔트러블 슈팅

`Your requested instance type (<instance type>) is not supported in your requested Availability Zone (<instance Availability Zone>)...`

오토스케일링 그룹 생성 시, ‘유효하지 않은 가용 영역’이라는 오류가 나며 생성을 실패한 경우가 발생했다. 이는 인스턴스 유형에 따라 가용 영역이 제한되는 경우가 있었기 때문이고, 인스턴스에 맞는 가용영역을 선택하여 해결하였다.

[Amazon EC2 Auto Scaling 문제 해결: EC2 인스턴스 시작 실패 - Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/ko_kr/autoscaling/ec2/userguide/ts-as-instancelaunchfailure.html#ts-as-instancelaunchfailure-6)

![](https://velog.velcdn.com/images/one1_programmer/post/eccbf418-4230-4dd9-9914-458475cb3521/image.png)
![](https://velog.velcdn.com/images/one1_programmer/post/8abd2a98-155c-4561-a752-eb9b008df8e4/image.png)



