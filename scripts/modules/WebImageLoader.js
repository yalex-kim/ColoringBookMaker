export class WebImageLoader {
    constructor() {
        this.corsProxies = [
            'https://cors-anywhere.herokuapp.com/',
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?'
        ];
    }

    async loadImage(url) {
        if (!this.isValidUrl(url)) {
            throw new Error('올바른 URL을 입력해주세요.');
        }

        // 직접 로드 시도
        try {
            const image = await this.loadImageDirect(url);
            return image;
        } catch (error) {
            console.log('직접 로드 실패, 프록시 사용 시도...');
        }

        // 프록시를 통한 로드 시도
        for (const proxy of this.corsProxies) {
            try {
                const proxyUrl = proxy + encodeURIComponent(url);
                const image = await this.loadImageDirect(proxyUrl);
                return image;
            } catch (error) {
                console.log(`프록시 ${proxy} 실패:`, error);
                continue;
            }
        }

        throw new Error('이미지 로드에 실패했습니다. 다른 이미지 URL을 시도해보세요.');
    }

    async loadImageDirect(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            const timeout = setTimeout(() => {
                reject(new Error('이미지 로드 시간 초과'));
            }, 15000); // 15초 타임아웃
            
            img.onload = () => {
                clearTimeout(timeout);
                resolve(img);
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('이미지 로드 실패'));
            };
            
            img.src = url;
        });
    }

    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    isImageUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
        const lowercaseUrl = url.toLowerCase();
        return imageExtensions.some(ext => lowercaseUrl.includes(ext));
    }
}