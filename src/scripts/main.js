import { ColoringBookProcessor } from './modules/ColoringBookProcessor.js';
import { GeminiAI } from './modules/GeminiAI.js';
import { ImageUploader } from './modules/ImageUploader.js';
import { WebImageLoader } from './modules/WebImageLoader.js';
import { UIController } from './modules/UIController.js';

class ColoringBookApp {
    constructor() {
        this.currentImage = null;
        this.finalCanvas = null;
        
        // 모듈 초기화
        this.processor = new ColoringBookProcessor();
        this.geminiAI = new GeminiAI();
        this.imageUploader = new ImageUploader();
        this.webLoader = new WebImageLoader();
        this.ui = new UIController();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.ui.init();
    }

    setupEventListeners() {
        // 모드 전환
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
            });
        });

        // 파일 업로드
        this.imageUploader.onImageLoaded = (image) => {
            this.handleImageLoaded(image);
        };

        // 웹 이미지 로드
        const loadImageBtn = document.getElementById('loadImageBtn');
        loadImageBtn?.addEventListener('click', () => {
            const url = document.getElementById('imageUrl').value;
            this.loadWebImage(url);
        });

        // AI 이미지 생성
        const generateBtn = document.getElementById('generateBtn');
        generateBtn?.addEventListener('click', () => {
            this.generateAIImage();
        });

        const improvePromptBtn = document.getElementById('improvePromptBtn');
        improvePromptBtn?.addEventListener('click', () => {
            this.improvePrompt();
        });

        // 예시 프롬프트
        document.querySelectorAll('.example-prompt').forEach(prompt => {
            prompt.addEventListener('click', (e) => {
                document.getElementById('promptInput').value = e.target.dataset.prompt;
            });
        });

        // 컨트롤
        const processBtn = document.getElementById('processBtn');
        processBtn?.addEventListener('click', () => {
            this.processImage();
        });

        const resetBtn = document.getElementById('resetBtn');
        resetBtn?.addEventListener('click', () => {
            this.resetInterface();
        });

        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn?.addEventListener('click', () => {
            this.downloadResult();
        });

        // 슬라이더 이벤트
        this.setupSliderEvents();
    }

    setupSliderEvents() {
        const sliders = ['threshold', 'blur', 'lineWidth'];
        
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            const valueDisplay = document.getElementById(sliderId + 'Value');
            
            if (slider && valueDisplay) {
                slider.addEventListener('input', (e) => {
                    valueDisplay.textContent = e.target.value;
                });
            }
        });
    }

    switchMode(mode) {
        // 탭 활성화
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // 컨텐츠 전환
        document.querySelectorAll('.mode-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${mode}-mode`).classList.add('active');

        this.resetInterface();
    }

    resetInterface() {
        this.currentImage = null;
        this.finalCanvas = null;
        
        // UI 숨기기
        document.getElementById('previewSection').style.display = 'none';
        document.getElementById('controlsSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'none';
        document.getElementById('aiResults').style.display = 'none';
        
        // 입력 초기화
        document.getElementById('imageUrl').value = '';
        document.getElementById('promptInput').value = '';
        
        this.ui.hideLoading();
    }

    handleImageLoaded(image) {
        this.currentImage = image;
        this.showPreview(image);
        this.showControls();
    }

    showPreview(image) {
        const previewSection = document.getElementById('previewSection');
        const previewImage = document.getElementById('previewImage');
        
        previewImage.src = image.src;
        previewSection.style.display = 'block';
    }

    showControls() {
        document.getElementById('controlsSection').style.display = 'block';
    }

    async loadWebImage(url) {
        if (!url) {
            alert('URL을 입력해주세요.');
            return;
        }

        try {
            this.ui.showLoading('이미지 로딩 중...');
            const image = await this.webLoader.loadImage(url);
            this.handleImageLoaded(image);
        } catch (error) {
            alert('이미지 로드에 실패했습니다: ' + error.message);
        } finally {
            this.ui.hideLoading();
        }
    }

    async generateAIImage() {
        const prompt = document.getElementById('promptInput').value.trim();
        if (!prompt) {
            alert('프롬프트를 입력해주세요.');
            return;
        }

        try {
            this.ui.showLoading('AI 이미지 생성 중...');
            const images = await this.geminiAI.generateImages(prompt);
            this.displayAIImages(images);
        } catch (error) {
            alert('이미지 생성에 실패했습니다: ' + error.message);
        } finally {
            this.ui.hideLoading();
        }
    }

    async improvePrompt() {
        const prompt = document.getElementById('promptInput').value.trim();
        if (!prompt) {
            alert('프롬프트를 입력해주세요.');
            return;
        }

        try {
            this.ui.showLoading('프롬프트 개선 중...');
            const improvedPrompt = await this.geminiAI.improvePrompt(prompt);
            document.getElementById('promptInput').value = improvedPrompt;
        } catch (error) {
            alert('프롬프트 개선에 실패했습니다: ' + error.message);
        } finally {
            this.ui.hideLoading();
        }
    }

    displayAIImages(images) {
        const aiResults = document.getElementById('aiResults');
        const generatedImages = document.getElementById('generatedImages');
        
        generatedImages.innerHTML = '';
        
        images.forEach((imageUrl, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'generated-image-container';
            
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `생성된 이미지 ${index + 1}`;
            img.addEventListener('click', () => this.selectAIImage(imageUrl));
            
            imgContainer.appendChild(img);
            generatedImages.appendChild(imgContainer);
        });
        
        aiResults.style.display = 'block';
    }

    async selectAIImage(imageUrl) {
        try {
            this.ui.showLoading('이미지 로딩 중...');
            const image = await this.webLoader.loadImage(imageUrl);
            this.handleImageLoaded(image);
        } catch (error) {
            alert('이미지 로드에 실패했습니다: ' + error.message);
        } finally {
            this.ui.hideLoading();
        }
    }

    async processImage() {
        if (!this.currentImage) {
            alert('이미지를 먼저 선택해주세요.');
            return;
        }

        try {
            this.ui.showLoading('컬러링북 변환 중...');
            
            const options = {
                threshold: parseInt(document.getElementById('threshold').value),
                blur: parseInt(document.getElementById('blur').value),
                lineWidth: parseInt(document.getElementById('lineWidth').value),
                invert: document.getElementById('invert').checked
            };

            this.finalCanvas = await this.processor.processImage(this.currentImage, options);
            this.showResult();
        } catch (error) {
            alert('이미지 처리에 실패했습니다: ' + error.message);
        } finally {
            this.ui.hideLoading();
        }
    }

    showResult() {
        const resultSection = document.getElementById('resultSection');
        const resultCanvas = document.getElementById('resultCanvas');
        
        // 캔버스 복제
        resultCanvas.width = this.finalCanvas.width;
        resultCanvas.height = this.finalCanvas.height;
        const ctx = resultCanvas.getContext('2d');
        ctx.drawImage(this.finalCanvas, 0, 0);
        
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    downloadResult() {
        if (!this.finalCanvas) {
            alert('처리된 이미지가 없습니다.');
            return;
        }

        const link = document.createElement('a');
        link.download = `coloring-book-${Date.now()}.png`;
        link.href = this.finalCanvas.toDataURL();
        link.click();
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ColoringBookApp();
});