# Video Brain

Video Brain은 YouTube 동영상 링크를 저장하고, 메타데이터 및 스크립트를 검색·조회할 수 있는 React 기반 웹 애플리케이션입니다. 또한 모바일 앱(WebView) 연동, 서버리스 함수, Google Apps Script를 활용한 로그 수집 기능을 포함합니다.

---

## 📦 디렉토리 구조

```
videobrain/
├── README.md               # 프로젝트 안내 문서
├── fe/                     # 프론트엔드 (React)
│   ├── build/              # 빌드 산출물
│   ├── api/                # Netlify Functions
│   │   ├── metadata.js
│   │   ├── transcript.js
│   │   └── get-ip.js
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── pages/          # React 페이지 (Router 대상)
│   │   └── utils/          # 쿠키·타임스탬프·쿼리 유틸
│   ├── public/             # 정적 파일 (index.html, APK 등)
│   │   └── file/           # APK 파일 위치 (/file/videoBrain.apk)
│   └── package.json
├── app/                    # 모바일 앱 (React Native Expo)
│   └── src/
│       ├── screens/        # 화면 컴포넌트 (AddScreen, ListScreen)
│       ├── utils/          # 앱용 유틸 함수 (AsyncStorage 등)
│       └── images/         # 앱용 이미지 리소스
│       └── package.json
└── netlify.toml        # 배포 설정
```

---

## 🔧 주요 기능

- **YouTube 메타데이터**: 제목, 작성자, 게시일, 조회수, 좋아요, 댓글 수, 길이 자동 추출
- **스크립트(자막) 로딩**: 자막 API 호출 후 보기/숨김 기능
- **검색 및 필터링**: 제목·작성자·스크립트별 검색 지원
- **로컬 저장**: 기기별 로컬스토리지에 최대 20개 저장, 중복 자동 제거
- **React Native WebView 연동**: 모바일 앱에서 웹뷰로 서비스 사용
- **APK 다운로드**: `/file/videoBrain.apk` 링크 또는 QR코드 제공
- **Android 전용 플로팅 버튼**: 앱 내 Kotlin으로 구현된 플로팅 액션 버튼 제공 (현재 Android 기기에서만 사용 가능)
- **서버리스 로깅**: Netlify Functions와 Google Apps Script로 방문·사용 로그 수집

---

## 🚀 배포 주소

- **웹 애플리케이션**: [https://videobrain.netlify.app](https://videobrain.netlify.app)
- **APK 다운로드 (QR 또는 직접)**: [https://videobrain.netlify.app/file/videoBrain.apk](https://videobrain.netlify.app/file/videoBrain.apk)

---

## 📱 모바일 앱 다운로드

1. **QR 코드**: QR 코드는 보안 및 만료 정책상 주기적으로 갱신될 수 있습니다.
2. **직접 링크**: `https://videobrain.netlify.app/file/videoBrain.apk`

---

## ⚙️ 사용 방법

### 1. 웹 서비스

- **기본 페이지**: `/service?utm=web` → PC/모바일 브라우저에서 사용
- **앱용 웹뷰**:
  - 메타데이터 입력/추가: `/service?utm=app&f=a`
  - 영상 목록 조회/검색/삭제: `/service?utm=app&f=s`

> URL 쿼리(`utm`, `f`)에 따라 화면 구성 및 기능이 달라집니다.

### 2. React 클라이언트

1. `npm install` → `npm start`
2. `/` 진입 후 YouTube URL 입력 → '영상 추가' 클릭
3. 좌측 목록에서 영상 선택 → 우측 상세 정보 및 자막 보기/숨김
4. 검색어 입력 및 체크박스로 제목·작성자·스크립트 필터링

### 3. React Native 앱

- **AddScreen**: 웹뷰로 `/service?utm=app&f=a`를 로드하여 영상 추가
- **ListScreen**: 웹뷰로 `/service?utm=app&f=s`를 로드하여 목록 조회·삭제

화면 전환 시 메시지(postMessage)와 로컬스토리지 동기화로 영상 목록을 유지합니다.

---

## ⚙️ 환경 설정

- Node.js (>=14.x) 및 npm 설치
- YouTube Data API Key 발급 → `fe/.env` 또는 Netlify 환경 변수에 `YOUTUBE_API_KEY`
- Netlify 계정으로 GitHub 연동 및 배포
- Google Apps Script 웹앱 배포 (익명 접근 권한)

---

## 🛠️ 배포 & 실행

### 로컬 개발

```bash
cd fe
npm install
npm start        # http://localhost:3000
# Netlify Functions 로컬 테스트
netlify dev      # /api/metadata, /api/transcript, /api/download
```

### 운영 배포

1. `netlify.toml` 설정 확인
2. Netlify Dashboard에 환경변수(`YOUTUBE_API_KEY`) 추가
3. Git Push → 자동 빌드·배포 → [https://videobrain.netlify.app](https://videobrain.netlify.app)

---

## 🔍 트러블슈팅

- **CORS 오류**: Apps Script를 순수 JSON 리턴(`response().json`)으로 설정. `encodeURIComponent` 사용
- **404/500 Function 오류**: `netlify.toml`의 `functions` 경로 및 파일명 확인
- **API 할당량 초과**: YouTube Data API 사용량 확인 및 요금제 검토

---

감사합니다! 📺🧠
