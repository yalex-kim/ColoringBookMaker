# 컬러링북 메이커 (Coloring Book Maker)

AI와 웹 기술을 활용한 현대적인 컬러링북 제작 도구입니다. 이미지를 업로드하거나 AI로 생성하여 컬러링북으로 변환할 수 있습니다.

## ✨ 주요 기능

### 🎨 3가지 이미지 입력 방식
- **📁 파일 업로드**: 로컬 이미지 파일 직접 업로드 (드래그 앤 드롭 지원)
- **🌐 웹 이미지 수집**: URL을 통한 웹 이미지 로드
- **🤖 AI 이미지 생성**: Gemini AI를 활용한 컬러링북 최적화 이미지 생성

### 🛠️ 고급 이미지 처리
- **엣지 검출**: Sobel 필터를 사용한 정확한 윤곽선 추출
- **가우시안 블러**: 노이즈 제거 및 선명도 조절
- **선 굵기 조절**: 컬러링하기 적합한 선 굵기 설정
- **색상 반전**: 배경과 선의 색상 반전 옵션
- **실시간 미리보기**: 설정 변경 시 즉시 결과 확인

### 🤖 AI 강화 기능
- **스마트 프롬프트 개선**: 간단한 키워드를 상세한 프롬프트로 자동 변환
- **컬러링북 특화 생성**: 명확한 윤곽선과 단순한 구조의 이미지 생성
- **다양한 스타일**: 동물, 식물, 건물, 캐릭터 등 다양한 주제 지원

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
2. Gemini API 키 설정:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

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
- **Image Processing**: Canvas API, Custom Algorithms
- **AI Integration**: Google Gemini API
- **Image Generation**: Pollinations AI (무료 API)

## 📱 반응형 디자인

- 데스크톱, 태블릿, 모바일 모든 기기 지원
- 터치 인터페이스 최적화
- 다양한 화면 크기 대응

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

## 🔮 향후 계획

- [ ] OpenCV.js를 활용한 고급 엣지 검출
- [ ] 자동 윤곽선 조정 기능
- [ ] 배치 처리 (여러 이미지 동시 처리)
- [ ] PWA 지원 (오프라인 사용 가능)
- [ ] 추가 AI 모델 통합
- [ ] 사용자 설정 저장 기능
- [ ] 소셜 미디어 공유 기능
