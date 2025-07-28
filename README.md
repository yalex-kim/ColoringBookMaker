# 컬러링북 메이커 (Coloring Book Maker)

AI와 웹 기술을 활용한 현대적인 컬러링북 제작 도구입니다. 이미지를 업로드하거나 AI로 생성하여 컬러링북으로 변환할 수 있습니다.

## ✨ 주요 기능

### 🎨 3가지 이미지 입력 방식
- **📁 파일 업로드**: 로컬 이미지 파일 직접 업로드 (드래그 앤 드롭 지원)
- **🌐 웹 이미지 수집**: URL을 통한 웹 이미지 로드
- **🤖 AI 이미지 생성**: AI를 활용한 컬러링북 최적화 이미지 생성

### 🛠️ 고급 이미지 처리 (OpenCV.js 기반)
- **Canny 엣지 검출**: OpenCV.js의 전문적인 엣지 검출 알고리즘
- **가우시안 블러**: 고급 노이즈 제거 및 이미지 전처리
- **형태학적 연산**: 엘립티컬 커널을 통한 자연스러운 선 처리
- **적응형 임계값**: 이미지별 최적화된 처리
- **메모리 관리**: 효율적인 OpenCV Mat 객체 관리
- **폴백 시스템**: OpenCV 미로드 시 기본 알고리즘 자동 전환

### 🤖 AI 강화 기능
- **스마트 프롬프트 개선**: 간단한 키워드를 상세한 프롬프트로 자동 변환
- **컬러링북 특화 생성**: 명확한 윤곽선과 단순한 구조의 이미지 생성
- **다양한 스타일**: 동물, 식물, 건물, 캐릭터 등 다양한 주제 지원
- **다중 AI 지원**: 여러 AI 서비스를 통한 다양한 이미지 생성 옵션

## 🚀 시작하기

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/yalex-kim/ColoringBookMaker.git
cd ColoringBookMaker

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build
```

### 환경 설정

1. `.env.example` 파일을 복사하여 `.env` 파일 생성
2. AI API 키 설정 (선택사항):
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### 시스템 요구사항

- **브라우저**: Chrome 57+, Firefox 52+, Safari 11+, Edge 79+
- **메모리**: 최소 4GB RAM (OpenCV.js 처리 시)
- **네트워크**: 최초 실행 시 OpenCV.js 라이브러리 다운로드 (약 8MB)
- **WebAssembly**: WASM 지원 브라우저 필수

## 🏗️ 프로젝트 구조

```
ColoringBookMaker/
├── src/
│   ├── index.html              # 메인 HTML 파일
│   ├── styles/
│   │   └── main.css           # 스타일시트
│   └── scripts/
│       ├── main.js            # 메인 애플리케이션
│       └── modules/           # 모듈화된 기능들
│           ├── ColoringBookProcessor.js  # 이미지 처리 엔진
│           ├── GeminiAI.js              # AI 이미지 생성
│           ├── ImageUploader.js         # 파일 업로드 관리
│           ├── WebImageLoader.js        # 웹 이미지 로드
│           └── UIController.js          # UI 제어
├── dist/                      # 빌드 결과물
├── package.json
├── vite.config.js            # Vite 설정
└── .env.example              # 환경 변수 예시
```

## 🔧 기술 스택

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite
- **Image Processing**: OpenCV.js 4.8.0, Canvas API
- **Computer Vision**: Canny Edge Detection, Gaussian Blur, Morphological Operations
- **AI Integration**: Multiple AI APIs
- **Image Generation**: Pollinations AI (무료 API)

## 📱 반응형 디자인

- 데스크톱, 태블릿, 모바일 모든 기기 지원
- 터치 인터페이스 최적화
- 다양한 화면 크기 대응

## ⚡ 성능 특징

- **비동기 로딩**: OpenCV.js는 백그라운드에서 로드되어 초기 페이지 로딩 속도 최적화
- **메모리 효율성**: OpenCV Mat 객체의 자동 메모리 관리로 메모리 누수 방지
- **폴백 시스템**: OpenCV 로드 실패 시 자동으로 기본 알고리즘 사용
- **실시간 상태 표시**: UI에서 OpenCV 로딩 상태를 실시간으로 확인 가능

## 🌐 라이브 데모

https://yalex-kim.github.io/ColoringBookMaker/

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📝 라이선스

이 프로젝트는 ISC 라이선스를 따릅니다.

## ✨ 최신 업데이트

### v2.0 - OpenCV.js 통합 (2025.01)
- ✅ **OpenCV.js 4.8.0 통합**: 전문적인 컴퓨터 비전 라이브러리 적용
- ✅ **Canny 엣지 검출**: 고급 엣지 검출 알고리즘으로 업그레이드
- ✅ **적응형 처리**: 이미지별 최적화된 threshold 계산
- ✅ **안정성 향상**: 폴백 시스템으로 호환성 보장

## 🔮 향후 계획

- [ ] 추가 AI 모델 통합
- [ ] 소셜 미디어 공유 기능
