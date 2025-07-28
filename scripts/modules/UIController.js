export class UIController {
    constructor() {
        this.loadingOverlay = null;
        this.loadingText = null;
    }

    init() {
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingText = document.getElementById('loadingText');
        this.setupResponsiveHandling();
    }

    showLoading(message = '처리 중...') {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'flex';
        }
        if (this.loadingText) {
            this.loadingText.textContent = message;
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'none';
        }
    }

    showMessage(message, type = 'info') {
        // 토스트 메시지 또는 알림 표시
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
        `;

        switch (type) {
            case 'success':
                messageDiv.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                messageDiv.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                messageDiv.style.backgroundColor = '#ff9800';
                break;
            default:
                messageDiv.style.backgroundColor = '#2196F3';
        }

        document.body.appendChild(messageDiv);

        // 3초 후 자동 제거
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    setupResponsiveHandling() {
        // 모바일 대응
        const handleResize = () => {
            const container = document.querySelector('.container');
            if (container) {
                if (window.innerWidth < 768) {
                    container.style.padding = '15px';
                    container.style.margin = '10px';
                } else {
                    container.style.padding = '30px';
                    container.style.margin = '0 auto';
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // 초기 실행
    }

    updateProgress(percentage) {
        // 진행률 표시 (필요시 구현)
        console.log(`Progress: ${percentage}%`);
    }

    animateElement(element, animation = 'fadeIn') {
        if (!element) return;

        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.3s ease';

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    scrollToElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    }
}