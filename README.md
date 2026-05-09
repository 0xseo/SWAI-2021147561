# Unknown Project: 웹-모바일 통합 YouTube 콘텐츠 관리 플랫폼

안녕하세요! 본 프로젝트는 웹 및 모바일 환경에서 YouTube 동영상을 효율적으로 관리하고 활용하기 위해 개발된 하이브리드 애플리케이션입니다. React 기반의 웹 프론트엔드와 React Native 기반의 모바일 앱을 통합하여 사용자에게 일관된 경험을 제공하며, 서버리스 아키텍처를 통해 확장성과 운영 효율성을 확보했습니다.

이 README 문서는 면접 및 포트폴리오 제출을 위한 목적으로 작성되었으며, 프로젝트의 핵심 기능, 구조, 사용 기술, 시스템 아키텍처 및 향후 개선 방향을 상세히 설명합니다.

-   **저장소 URL**: [https://github.com/0xseo/SWAI-2021147561](https://github.com/0xseo/SWAI-2021147561)

## 주요 기능

본 프로젝트는 다음과 같은 주요 기능을 제공합니다.

*   **YouTube 동영상 URL 기반 정보 추출**: YouTube 동영상 URL을 입력받아 해당 동영상의 제목, 작성자, 썸네일, 조회수 등의 메타데이터와 자막(스크립트) 데이터를 자동으로 추출합니다.
*   **동영상 목록 관리**: 추출된 동영상 정보를 목록 형태로 저장하고 조회할 수 있습니다.
*   **메타데이터 및 스크립트 표시**: 각 동영상의 상세 페이지에서 메타데이터와 전체 스크립트를 사용자에게 보여줍니다.
*   **검색 및 필터링**: 저장된 동영상 목록 내에서 특정 키워드로 검색하거나 필터링하여 원하는 동영상을 쉽게 찾을 수 있습니다.
*   **웹 및 모바일 통합 경험**: React 웹 애플리케이션과 React Native 모바일 앱이 동일한 핵심 기능을 공유하며, WebView를 통해 모바일 앱에서 웹 콘텐츠를 원활하게 로드하여 활용합니다.
*   **Android 플로팅 버튼 (모바일 전용)**: Android 기기에서 앱이 실행 중일 때 플로팅 버튼을 통해 특정 기능을 빠르게 실행할 수 있습니다.
*   **사용 로그 수집 시스템**: Google Apps Script와 연동하여 사용자 방문 및 기능 사용 로그를 수집하고 기록합니다.

## 프로젝트 구조 (추정)

프로젝트의 명확한 디렉토리 구조 설명은 제공되지 않았지만, 핵심 파일 및 기술 스택 분석을 통해 다음과 같은 구조를 추정할 수 있습니다.

*   `fe/`: React 기반의 웹 프론트엔드 애플리케이션이 위치합니다.
    *   `fe/src/`: React 컴포넌트, 페이지, 전역 스타일 등이 포함됩니다.
    *   `fe/api/`: Netlify Functions로 배포될 서버리스 함수 코드가 위치합니다.
*   `mobile/`: React Native 기반의 모바일 애플리케이션이 위치합니다.
    *   `mobile/android/`: Android 플랫폼의 네이티브 모듈 (Kotlin) 코드가 포함됩니다.
*   `be/`: (추정) Express.js 기반의 로컬 개발용 백엔드 서버 또는 Netlify Functions의 대안으로 고려되었던 코드가 위치합니다.
*   `수업/`: (추정) 개발 과정 중의 학습 자료, 이전 버전의 코드, 또는 테스트 페이지 등 정적 파일들이 포함된 디렉토리로 보입니다.

## 핵심 파일 설명

프로젝트의 주요 기능을 구현하는 핵심 파일들은 다음과 같습니다.

*   **`fe/README.md`**: 프로젝트의 전반적인 소개, 목적, 디렉토리 구조, 주요 기능, 배포 주소, 사용 방법, 환경 설정 등 프로젝트의 모든 중요한 정보를 담고 있는 핵심 문서입니다. 프로젝트의 '얼굴' 역할을 하며, 개발자와 사용자 모두에게 가이드라인을 제공합니다.
*   **`fe/src/App.js`**: 웹 프론트엔드(React) 애플리케이션의 최상위 컴포넌트이자 라우팅 설정 파일입니다. React Router를 사용하여 `/` 경로에는 `Home` 페이지를, `/service` 경로에는 핵심 서비스 기능이 구현된 `Service` 페이지를 연결하고 있습니다. 전역 CSS 및 Bootstrap 설정을 포함합니다.
*   **`fe/src/pages/Service.js`**: 웹 애플리케이션의 핵심 기능을 담당하는 페이지입니다. YouTube URL 입력, 영상 목록 조회, 메타데이터 및 스크립트 표시, 검색 및 필터링 기능 등 대부분의 사용자 상호작용이 이 페이지에서 이루어질 것으로 추정됩니다. 모바일 앱의 WebView에서도 이 페이지를 로드하여 사용합니다.
*   **`fe/api/youtube_metadata.js`**: Netlify Functions로 배포되는 서버리스 함수입니다. YouTube 동영상 URL을 받아 YouTube Data API를 호출하여 해당 동영상의 메타데이터(제목, 작성자, 썸네일, 조회수 등)를 추출하고 반환하는 역할을 합니다. API 키를 안전하게 관리하며 클라이언트 측에서 직접 API를 호출하는 부담을 줄여줍니다.
*   **`fe/api/youtube_transcript.js`**: Netlify Functions로 배포되는 서버리스 함수입니다. YouTube 동영상 URL을 받아 `youtube-transcript-api` 라이브러리를 사용하여 동영상의 자막(스크립트) 데이터를 가져와 반환하는 역할을 합니다. 자막이 없거나 API 호출 오류 발생 시 빈 배열을 반환하여 안정성을 확보합니다.
*   **`mobile/App.js`**: React Native 모바일 앱의 최상위 컴포넌트입니다. React Navigation을 사용하여 앱의 전반적인 화면 탐색 구조를 설정합니다. `AppInner.js`를 감싸는 형태로 내비게이션 컨테이너를 제공합니다.
*   **`mobile/src/screens/MobileAddScreen.js`**: 모바일 앱에서 웹뷰를 통해 새로운 YouTube 동영상을 추가하는 기능을 담당하는 화면입니다. 웹 애플리케이션의 `/service?utm=app&f=a` 경로를 로드하여 웹의 추가 기능을 활용합니다.
*   **`mobile/src/screens/MobileServiceScreen.js`**: 모바일 앱에서 웹뷰를 통해 저장된 YouTube 동영상 목록을 조회하고 관리하는 기능을 담당하는 화면입니다. 웹 애플리케이션의 `/service?utm=app&f=s` 경로를 로드하여 웹의 목록 및 검색 기능을 활용합니다.
*   **`mobile/android/app/src/main/java/.../FloatingButtonService.kt`**: Android OS에서 동작하는 네이티브 Kotlin 서비스 파일입니다. 모바일 앱의 Android 전용 플로팅 버튼 기능을 실제로 구현하고 제어하는 역할을 합니다. React Native와 네이티브 모듈 간의 연동을 보여주는 중요한 부분입니다.
*   **`be/index.js`**: (추정) Express.js 기반의 로컬 개발용 백엔드 서버 또는 대안적인 API 엔드포인트입니다. `youtube-transcript-api`와 `axios`를 사용하여 YouTube 동영상 ID 추출, 자막 및 메타데이터를 가져오는 기능을 제공합니다. `fe/api`의 Netlify Functions와 기능적으로 중복되는 것으로 보아, Netlify Functions를 사용하지 않을 경우의 대안이거나 개발 과정에서 사용되었을 가능성이 있습니다.

## 기술 스택 및 선택 이유

본 프로젝트는 다음과 같은 기술 스택을 활용하여 개발되었습니다. 각 기술의 선택 이유는 효율성, 확장성, 개발 편의성 등을 고려한 것입니다.

### Frontend (Web)

*   **React (19.1.0)**: 컴포넌트 기반 UI 개발을 통해 코드의 재사용성과 유지보수성을 향상시키고, 선언적인 방식으로 복잡한 UI를 효율적으로 구축할 수 있습니다.
*   **React Router DOM (7.6.2)**: 클라이언트 사이드 라우팅을 구현하여 단일 페이지 애플리케이션(SPA)으로서의 부드러운 사용자 경험을 제공합니다.
*   **Axios (1.9.0)**: Promise 기반 HTTP 클라이언트로, 비동기 통신 코드를 간결하게 작성하고 서버와의 데이터 교환을 쉽게 처리할 수 있습니다.
*   **Bootstrap (5.3.6)**: 반응형 디자인 및 사전 정의된 UI 컴포넌트를 제공하여 빠르고 일관성 있는 웹 인터페이스 개발을 가능하게 합니다.
*   **Web Local Storage**: 클라이언트 기기에 간단한 데이터를 영구적으로 저장하여 사용자 설정이나 임시 데이터 관리에 유용하게 활용됩니다.

### Frontend (Mobile)

*   **React Native (0.79.2)**: 하나의 코드베이스로 iOS 및 Android 앱을 동시에 개발할 수 있어 개발 시간과 비용을 절감하며, React의 강점을 모바일 환경으로 확장합니다.
*   **Expo (53.0.9)**: React Native 개발 환경 설정을 간소화하고, 테스트 및 배포 과정을 편리하게 만들어 개발 생산성을 크게 향상시킵니다.
*   **React Native WebView (13.13.5)**: 웹 콘텐츠를 앱 내에서 표시할 수 있도록 하여 웹 애플리케이션의 핵심 기능을 모바일 앱에 통합하는 하이브리드 경험을 제공합니다.
*   **@react-native-async-storage/async-storage (2.1.2)**: 비동기 영구 저장소를 사용하여 앱 데이터를 안정적으로 관리하고, 오프라인 기능 구현의 기반을 제공합니다.
*   **React Navigation (7.1.10)**: 네이티브 스택 기반으로 복잡한 화면 간의 탐색 구조를 효율적으로 구현하고, 사용자 친화적인 내비게이션 경험을 제공합니다.
*   **Kotlin**: Android 네이티브 모듈 개발에 활용되어 React Native로 구현하기 어려운 특정 플랫폼 기능(예: 플로팅 버튼)을 확장하고 제어할 수 있게 합니다.

### Backend (Serverless)

*   **Node.js**: 비동기 이벤트 기반 런타임으로, 고성능 및 확장성 있는 서버와 서버리스 함수를 구현하는 데 적합합니다.
*   **Netlify Functions**: 서버리스 환경에서 백엔드 로직을 배포하여 서버 인프라 관리의 복잡성을 줄이고, 필요에 따라 자동으로 확장되어 운영 효율성을 높입니다.
*   **youtube-transcript-api (2.0.4)**: YouTube 동영상 자막 데이터를 효율적으로 추출하여, 동영상 콘텐츠 분석 및 활용에 필요한 핵심 데이터를 제공합니다.
*   **Google Data API (YouTube Data API v3)**: YouTube 플랫폼의 풍부한 데이터에 접근하여 동영상 정보 및 통계를 안전하고 공식적으로 확보합니다.
*   **Google Apps Script**: Google 서비스와의 강력한 연동을 통해 커스텀 로그 수집 시스템을 구축하여, 사용자 활동 모니터링 및 분석에 활용합니다.

### Backend (Local Development Only)

*   **Express (5.1.0)**: Node.js 웹 애플리케이션 프레임워크로, RESTful API 개발을 간소화하고 빠르고 유연하게 백엔드 서비스를 구축할 수 있도록 돕습니다.
*   **nodemon (3.1.10)**: 개발 중 코드 변경 시 서버를 자동으로 재시작하여 개발 생산성을 크게 향상시킵니다.
*   **openai (4.103.0)** (참고: 코드에서 사용되지 않음): 고급 자연어 처리 기능을 통한 AI 연동 가능성을 열어두어, 향후 영상 스크립트 요약, 질의응답 시스템 등 다양한 AI 기능을 추가할 수 있습니다.

### DevOps & Infrastructure

*   **Netlify**: CI/CD, CDN, 서버리스 함수를 통합하여 웹 배포 및 관리를 자동화하고, 빠르고 안정적인 서비스 제공을 가능하게 합니다.
*   **Git / GitHub**: 버전 관리 및 협업을 위한 표준 플랫폼으로, 코드 변경 이력을 체계적으로 관리하고 팀원 간의 효율적인 협업을 지원합니다.

## 시스템 아키텍처

Video Brain 프로젝트는 React 기반의 웹 애플리케이션과 React Native 기반의 모바일 애플리케이션을 통합한 하이브리드 아키텍처를 채택하고 있습니다. 웹 프론트엔드는 Netlify에 배포되어 Netlify Functions(Node.js)를 통해 YouTube 메타데이터 및 자막을 가져옵니다. 모바일 앱은 WebView를 활용하여 웹 애플리케이션의 핵심 기능을 표시하며, AsyncStorage를 사용한 로컬 저장과 Android Kotlin 모듈을 통한 플로팅 버튼 등 플랫폼별 기능을 추가했습니다. 모든 방문 및 사용 로그는 Netlify Functions를 통해 Google Apps Script로 전송되어 기록됩니다. 'be' 폴더에는 별도의 Node.js/Express 백엔드가 존재하지만, 이는 주로 로컬 개발 환경 또는 대안적 배포 경로로 보이며, 현재 Netlify 기반 웹 앱의 주 백엔드는 Netlify Functions입니다. 웹 애플리케이션은 Android APK 파일을 직접 다운로드할 수 있도록 제공합니다.

```mermaid
graph TD
    classDef backend fill:#D4E6F1,stroke:#3498DB,stroke-width:2px;
    classDef external fill:#FADBD8,stroke:#E74C3C,stroke-width:2px;
    classDef storage fill:#D1F2EB,stroke:#2ECC71,stroke-width:2px;
    classDef user fill:#FCF3CF,stroke:#F1C40F,stroke-width:2px;
    classDef frontend fill:#E6F7E9,stroke:#52BE80,stroke-width:2px;

    U[사용자]:::`user`
    FE_WEB[웹 프론트엔드 (React)]:::`frontend`
    FE_MOBILE[모바일 앱 (React Native)]:::`frontend`
    NFLY_FN["Netlify Functions (Node.js)"]:::`backend`
    YT_DATA_API["Google YouTube Data API"]:::`external`
    GOOGLE_APPS_SCRIPT["Google Apps Script (로그 수집)"]:::`external`
    WEB_LOCAL_STORAGE["Web Local Storage"]:::`storage`
    MOBILE_ASYNC_STORAGE["Mobile AsyncStorage"]:::`storage`
    ANDROID_KOTLIN["Android Kotlin Module (플로팅 버튼)"]:::`backend`
    BE_LOCAL["로컬 개발 백엔드 (Node.js/Express)"]:::`backend`

    U -- "웹 브라우저 접속" --> FE_WEB
    U -- "모바일 앱 설치/실행" --> FE_MOBILE

    FE_WEB -- "메타데이터/자막 요청" --> NFLY_FN
    FE_WEB -- "데이터 저장/조회" --> WEB_LOCAL_STORAGE
    FE_WEB -- "APK 파일 제공" --> U

    FE_MOBILE -- "WebView로 웹 기능 로드" --> FE_WEB
    FE_MOBILE -- "데이터 저장/조회" --> MOBILE_ASYNC_STORAGE
    FE_MOBILE -- "Android 플랫폼 특정 기능" --> ANDROID_KOTLIN

    NFLY_FN -- "YouTube 정보 요청" --> YT_DATA_API
    NFLY_FN -- "방문/사용 로그 전송" --> GOOGLE_APPS_SCRIPT

    BE_LOCAL -- "메타데이터/자막 요청 (대안/개발용)" --> YT_DATA_API
```

## 실행 방법

(추가 작성 필요)

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따를 수 있습니다.

1.  **저장소 클론**:
    ```bash
    git clone https://github.com/0xseo/SWAI-2021147561.git
    cd SWAI-2021147561
    ```

2.  **웹 프론트엔드 (React) 실행**:
    ```bash
    cd fe
    npm install
    npm start # 또는 yarn start
    ```
    (Netlify Functions는 Netlify에 배포되므로 별도 로컬 실행은 필요 없거나, Netlify CLI를 통해 에뮬레이션할 수 있습니다.)

3.  **모바일 앱 (React Native) 실행**:
    ```bash
    cd mobile
    npm install
    npx expo start # 또는 yarn start
    ```
    이후 Expo Go 앱을 통해 에뮬레이터 또는 실제 기기에서 앱을 실행할 수 있습니다. Android 네이티브 모듈(Kotlin)이 필요한 경우, Android Studio를 통해 빌드해야 할 수 있습니다.

4.  **로컬 개발 백엔드 (Express.js) 실행 (선택 사항)**:
    `be/index.js`가 실제로 사용되는 경우에만 해당됩니다.
    ```bash
    cd be
    npm install
    npm start # 또는 nodemon index.js
    ```
    이 백엔드가 `fe`의 Netlify Functions를 대체하는지 확인이 필요합니다.

## 개선 방향

현재 프로젝트의 분석 결과를 바탕으로, 다음과 같은 개선 방향을 제안합니다.

*   **`be/` 디렉토리의 역할 명확화**: 현재 `readme.md`에서는 서버리스 함수로 `fe/api/`의 Netlify Functions를 명시하고 있습니다. 하지만 `be/` 디렉토리에도 유사한 기능을 하는 Express.js 서버(`be/index.js`)가 존재합니다. 이 `be/`가 로컬 개발을 위한 것인지, 아니면 Netlify Functions의 대안으로 고려되었으나 현재는 사용되지 않는 코드인지 명확히 문서화해야 합니다. 프로젝트의 최종 배포 버전에서는 `fe/api`가 사용되고 `be/`는 사용되지 않을 것으로 **추정**됩니다.
*   **`be/package.json`의 `openai` 의존성 활용**: `be/package.json`에는 `openai` 패키지가 포함되어 있지만, 제공된 `be/index.js` 코드에서는 `openai`를 사용하는 부분이 발견되지 않습니다. 만약 `be/` 백엔드가 활성화된다면, `openai`를 활용하여 영상 스크립트 요약, 키워드 추출, 추천 시스템 등 고급 AI 기능을 추가할 수 있을 것으로 보이며, 이에 대한 구현 계획 또는 제거 여부 결정이 필요합니다.
*   **`수업/` 디렉토리 정리**: `수업/` 디렉토리는 `fe/public`과 유사한 정적 파일(CSS, 이미지, HTML)을 다수 포함하고 있습니다. 현재 프로젝트에 직접적으로 포함된 활성 코드라기보다는, 개발 과정 중의 학습 자료, 이전 버전의 코드, 또는 테스트 페이지 등으로 **추정**됩니다. 이 디렉토리의 현재 역할에 대한 명확한 설명을 추가하거나, 최종 배포 버전에서는 제거하여 프로젝트를 간소화하는 것을 고려할 수 있습니다.
*   **코드 주석 및 문서화 강화**: 주요 기능 및 복잡한 로직에 대한 코드 주석을 추가하고, 각 디렉토리 및 파일의 역할을 설명하는 문서를 보강하여 다른 개발자의 이해도를 높일 수 있습니다.
*   **에러 핸들링 및 유효성 검사 강화**: 사용자 입력 및 외부 API 호출에 대한 에러 핸들링과 유효성 검사 로직을 더욱 견고하게 구현하여 애플리케이션의 안정성과 사용자 경험을 향상시킬 수 있습니다.
*   **테스트 코드 작성**: 단위 테스트 및 통합 테스트 코드를 작성하여 코드 변경 시 발생할 수 있는 잠재적 버그를 사전에 방지하고 유지보수성을 높일 수 있습니다.
*   **데이터베이스 연동 고려**: 현재 클라이언트 측 로컬 저장소에 데이터를 저장하는 것으로 보입니다. 사용자별 데이터를 영구적으로 저장하고 관리하려면 Firebase, MongoDB, PostgreSQL 등 실제 데이터베이스와의 연동을 고려해볼 수 있습니다.
*   **배포 자동화 개선**: CI/CD 파이프라인을 더욱 세분화하고 자동화하여, 코드 변경 시 빌드, 테스트, 배포가 자동으로 이루어지도록 구축할 수 있습니다.