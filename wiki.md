# 프로젝트 구성

### Atom Design 적용

https://brunch.co.kr/@ultra0034/63

모두 적용하기 힘드므로 네이버에서 적용한 3단계로 나눈 모델 사용

atom -> module -> templete

https://tv.naver.com/v/11994379

### 프로젝트 실행 및 빌드

1. yarn start -> 테스트 서버 구동

   - http://localhost:3000/test : 테스트 페이지

   - http://localhost:3000/status/remote : 구성 페이지

2. yarn build → production 빌드

- /build 폴더에 파일 생성 됨.

3. Rest API와 서버 통신

   package.json

   - "proxy": "http://localhost:3001" ← Rest API 서버 주소 입력

### 주요 라이브러리

1. typescript
2. ant design
3. redux-toolkit
4. react-query
5. emotion

### 기타
npx create-react-app 프로젝트이름

yarn add axios



프로젝트 실행
docker pull postgres

1. 프로젝트/docker 폴더
docker compose up -d  	>> postgres 도커컨터이너 실행

2. 프로젝트 폴더
yarn install

3. 프로젝트/server 폴더 
yarn install


4. 서버 실행
프로젝트 폴더
./server.bat

5. 웹 실행
프로젝트 폴더 yarn start

6. db데이터 생성
get http://localhost:3001/api/init/db

7. db잡데이터 생성
get http://localhost:3001/api/init/job








---

# /api/status

## get /api/status/remote

- remote job status list취득
- response

  ```typescript
  export interface ResGetRemoteJobStatus {
    id: number;   //job id
    siteId: number
    stop: boolean;
    siteName: string;
    fabName: string;
    collectStatus: BuildStatus;
    errorSummaryStatus: BuildStatus;
    crasDataStatus: BuildStatus;
    mpaVersionStatus: BuildStatus;
  }

  export type BuildStatus = 'success' | 'failure' | 'notbuild' | 'processing';

  ex)
  [
    {
        "id": 1,
        "siteId", 1,
        "stop": false,
        "siteName": "siteName0",
        "fabName": "fabName_0",
        "collectStatus": "success",
        "errorSummaryStatus": "failure",
        "crasDataStatus": "success",
        "mpaVersionStatus": "failure"
    },
    {
        "id": 2,
        "siteId", 2,
        "stop": false,
        "siteName": "siteName1",
        "fabName": "fabName_1",
        "collectStatus": "notbuild",
        "errorSummaryStatus": "failure",
        "crasDataStatus": "success",
        "mpaVersionStatus": "success"
    },
    {
        "id": 3,
        "siteId", 3,
        "stop": false,
        "siteName": "siteName2",
        "fabName": "fabName_2",
        "collectStatus": "failure",
        "errorSummaryStatus": "failure",
        "crasDataStatus": "notbuild",
        "mpaVersionStatus": "failure"
    }
  ]
  ```

---

## get /api/status/remote/:id

- remote job status 세부 정보 취득
- request param
  1. id: remote job id
- response

  ```typescript
  export interface ResGetRemoteJob {
    id: number;   // job id
    siteId: number;
    siteName: string;
    fabName: string;
    errorSummary: MailContext;
    crasData: MailContext;
    mpaVersion: MailContext;
    planIds: number[];
    sendingTimes: string[];   // 24시간 ["11:00", "12:00"]
    before: number;   //second
  }

  export interface MailContext {
    enable: boolean;
    recipients: string[];
    subject: string;
    body: string;
  }

  ex)
  {
    "id": 1,
    "siteId", 1,
    "siteName": "siteName0",
    "fabName": "fabName_0",
    "errorSummary": {
        "enable": true,
        "recipients": [
            "chpark@canon.bs.co.kr",
            "chpark2@canon.bs.co.kr"
        ],
        "subject": "hello? errorSummaryEmail",
        "body": "this is body?"
    },
    "crasData": {
        "enable": true,
        "recipients": [
            "chpark@canon.bs.co.kr",
            "chpark2@canon.bs.co.kr"
        ],
        "subject": "hello? crasDataEmail",
        "body": "this is body?"
    },
    "mpaVersion": {
        "enable": true,
        "recipients": [
            "chpark@canon.bs.co.kr",
            "chpark2@canon.bs.co.kr"
        ],
        "subject": "hello? version_email",
        "body": "this is body?"
    },
    "planIds": [
        2,
        4,
        6,
        8
    ],
    "sendingTimes": [
        "11:00",
        "23:00"
    ],
    "before": 86400
  }
  ```

---

## post /api/status/remote

- remote job 추가
- request body

  ```typescript
  export interface ReqPostRemoteJob {
    siteId: number;
    planIds: number[];
    notification: {
      isErrorSummary: boolean;
      isCrasData: boolean;
      isMpaVersion: boolean;
      sendingTimes: string[];
      before: number;
      errorSummaryEmail?: RemoteNotification | undefined;
      crasDataEmail?: RemoteNotification | undefined;
      mpaVersionEmail?: RemoteNotification | undefined;
    };
  }

  ex)
  {
    "siteId": 1,
    "planIds": [
      2,
      4,
      6,
      8
    ],
    "sendingTimes": [
      "11:00",
      "23:00"
    ],
    "before": 86400
    "notification": {
      "isErrorSummary": true,
      "isCrasData": true,
      "isMpaVersion": true,
      "errorSummaryEmail": {
        "recipients": [
          "chpark@canon.bs.co.kr",
          "chpark2@canon.bs.co.kr"
        ],
        "subject": "hello? errorSummaryEmail",
        "body": "this is body?"
      },
      "crasDataEmail": {
        "recipients": [
            "chpark@canon.bs.co.kr",
            "chpark2@canon.bs.co.kr"
        ],
        "subject": "hello? crasDataEmail",
        "body": "this is body?"
      },
      "mpaVersion": {
          "recipients": [
              "chpark@canon.bs.co.kr",
              "chpark2@canon.bs.co.kr"
          ],
          "subject": "hello? version_email",
          "body": "this is body?"
      },
  }
  ```

- response
  ```typescript
  export interface ResPostRemoteJob {
    id: number;
  }
  ```

---

## delete api/status/remote/:id

- remote job 삭제
- request param
  1.  id: remote job id
- response
  ```typescript
  export interface ResPostRemoteJob {
    id: number;
  }
  ```

---

## put /api/status/remote/:id

- remote job 수정
- 생각해볼것
  1. job 1개에 1site에 매칭되므로 1site에 여러잡이 중복 될 수 업다.
  2. 따라서, edit시, site를 변경 할 수는 없을 것 같다.
  3. 아니면, job name을 별도로 생성하여 1site당 여러잡을 생성가능하게 하는 방법을 고려해야 한다.
- request param
  1.  id: remote job id
- request body

  ```typescript
  export interface ReqPostRemoteJob {
    planIds: number[];
    notification: {
      isErrorSummary: boolean;
      isCrasData: boolean;
      isMpaVersion: boolean;
      sendingTimes: string[];
      before: number;
      errorSummaryEmail: RemoteNotification;
      crasDataEmail: RemoteNotification;
      mpaVersionEmail: RemoteNotification;
    };
  }

  ex)
  {
    "planIds": [
      2,
      4,
      6,
      8
    ],
    "sendingTimes": [
      "11:00",
      "23:00"
    ],
    "before": 86400
    "notification": {
      "isErrorSummary": true,
      "isCrasData": true,
      "isMpaVersion": true,
      "errorSummaryEmail": {
        "recipients": [
          "chpark@canon.bs.co.kr",
          "chpark2@canon.bs.co.kr"
        ],
        "subject": "hello? errorSummaryEmail",
        "body": "this is body?"
      },
      "crasDataEmail": {
        "recipients": [
            "chpark@canon.bs.co.kr",
            "chpark2@canon.bs.co.kr"
        ],
        "subject": "hello? crasDataEmail",
        "body": "this is body?"
      },
      "mpaVersion": {
          "recipients": [
              "chpark@canon.bs.co.kr",
              "chpark2@canon.bs.co.kr"
          ],
          "subject": "hello? version_email",
          "body": "this is body?"
      },
  }
  ```

- response
  ```typescript
  export interface ResPostRemoteJob {
    id: number;
  }
  ```

---

## patch /api/statusremote/:id/run

- remote job 시작
- request param
  1.  id: remote job id
- response
  ```typescript
  export interface ResPostRemoteJob {
    id: number;
  }
  ```

---

## patch /api/status/remote/:id/stop

- remote job 중지
- request param
  1.  id: remote job id
- response
  ```typescript
  export interface ResPostRemoteJob {
    id: number;
  }
  ```

---

## get /api/status/local

-- local job status 리스트 취득

- response

  ```typescript
  export interface ResPostRemoteJob {
    id: number;
    siteName: string;
    fabName: string;
    collectStatus: BuildStatus;
    fileIds: number[];
    fileNames: string[];
  }

  export type BuildStatus = 'success' | 'failure' | 'notbuild' | 'processing';

  ex)
  [
    {
        "id": 31,
        "siteName": "siteName0",
        "fabName": "fabName_0",
        "collectStatus": "notbuild",
        "fileIds": [
            839866,
            12402
        ],
        "fileNames": [
            "8d12ceaab2c39c1f908f0ae703.zip",
            "e4cb4be467aedd7f50fc87f858.zip"
        ]
    },
    {
        "id": 32,
        "siteName": "siteName1",
        "fabName": "fabName_1",
        "collectStatus": "failure",
        "fileIds": [
            707972
        ],
        "fileNames": [
            "4b5779dfb8245056566842b2f7.zip"
        ]
    }
  ]
  ```

---

## post /api/status/local/upload

- local file 업로드
- request : multi file
- response
  ```typescript
  fileId: number;
  ```

---

## post /api/status/local

- local job 추가
- request

  ```typescript
  export interface ReqPostLocalJob {
    siteId: number;
    fileIds: number[];
    filenames: string[];
  }

  ex)
  {
    "siteId": 1,
    "fileIds": [1, 2, 3],
    "filenames": ["abc.zip", "def.zip", "ghi.zip"]

  }
  ```

---

# /api/configure

## get /api/configure/sites/:id/plans

- plan list 취득
- /rss/api/system/machinesInfo 참조
- request param
  1. id: site id
- response
  ```typescript
  export interface ResGetRemotePlan {
    planId: number;
    planName: string;
    planType: string;
    machineNames: string[];
    targetNames: string[]; // ftp: categoryNames, vftp: commands
    description: string;
    status: string;
  }
  ```

---

## get /api/configure/sites/names

- site name 리스트 취득
- response
  ```typescript
  export interface ResGetSiteName {
    id: number;
    siteName: string;
    fabName: string;
  }
  ```

---

## get /api/configure/sites/:id

- site 리스트 취득
- request param
  1. id: siteid (siteId가 있는 경우, 해당 site만 취득, 없으면 전체 리스트 취득)
- response
  ```typescript
    {
      id: number;
      siteName: string;
      fabName: string;
      address: string;
      port: number;
      user: string;
      password: string;
      dbAddress: string;
      dbPort: number;
      dbPassword: string;
      excuteMpas: string[];   // MPA Names
    }
  ```

---

## post /api/configure/sites

- site 추가
- request
  ```typescript
    {
      siteName: string;
      fabName: string;
      address: string;
      port: number;
      user: string;
      password: string;
      dbAddress: string;
      dbPort: number;
      dbPassword: string;
      excuteMpas: string[];   // MPA Names
    }
  ```
  - response
  ```typescript
  {
    id: string;
  }
  ```

---

## put /api/configure/sites/:id

- site 수정
- request param
  1. id: site id
- request
  ```typescript
    {
      siteName: string;
      fabName: string;
      address: string;
      port: number;
      user: string;
      password: string;
      dbAddress: string;
      dbPort: number;
      dbPassword: string;
      excuteMpas: string[];      // MPA Names
    }
  ```
- response
  ```typescript
  {
    id: string;
  }
  ```

---

## delete /api/configure/sites/:id

- site 삭제
- request param
  1. id: site id
- response
  ```typescript
  {
    id: string;
  }
  ```

---

## get /api/configure/host

- setting db 정보 취득
- response
  ```typescript
  {
    ip: string;
    port: number;
    user: string;
    password: string;
  }
  ```

## put /api/configure/host

- setting db 정보 수정
- response
  ```typescript
  {
    ip: string;
    port: number;
    user: string;
    password: string;
  }
  ```

---

## get /api/configure/sites/:id/mpas

- mpa 리스트 취득
- request param
  1. id: site id
- response
  ```typescript
  {
    line: string;
    machineName: string;
    toolType: string;
  }
  ```

---

## 추가적으로 필요한 API

1. Log Definitions 리스트 취득
2. Log Definitions Export
3. Log Definitions Import
4. Converter 리스트 취득
5. Converter Export
6. Converter Import
7. Job History 데이터 취득
