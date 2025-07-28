export class GeminiAI {
    constructor() {
        this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDUxQZExYN5FBNwNFB6aR6zp5v-zJL5OdM';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    }

    async improvePrompt(userPrompt) {
        const prompt = `다음 간단한 프롬프트를 컬러링북에 적합한 상세한 영어 프롬프트로 개선해주세요. 
        윤곽선이 명확하고 단순한 구조의 이미지가 되도록 해주세요:

        입력: "${userPrompt}"
        
        개선된 프롬프트를 영어로만 답변해주세요. 설명은 불필요합니다.`;

        try {
            const response = await this.callGeminiAPI(prompt);
            return response.trim();
        } catch (error) {
            console.error('프롬프트 개선 실패:', error);
            throw new Error('프롬프트 개선에 실패했습니다.');
        }
    }

    async generateImages(userPrompt) {
        try {
            // 1. 프롬프트 최적화
            const optimizedPrompt = await this.generateOptimizedColoringPrompt(userPrompt);
            
            // 2. 다양한 스타일 프롬프트 생성
            const stylePrompts = await this.generateMultipleStylePrompts(optimizedPrompt);
            
            // 3. 무료 API로 이미지 생성
            const images = await this.generateImagesWithFreeAPI(stylePrompts);
            
            return images;
        } catch (error) {
            console.error('이미지 생성 실패:', error);
            throw new Error('이미지 생성에 실패했습니다.');
        }
    }

    async generateOptimizedColoringPrompt(userPrompt) {
        const prompt = `다음 요청을 컬러링북에 최적화된 이미지 생성 프롬프트로 변환해주세요:

        사용자 요청: "${userPrompt}"

        요구사항:
        1. 명확하고 굵은 윤곽선
        2. 단순하고 깔끔한 구조
        3. 컬러링하기 좋은 큰 영역들
        4. 과도하게 복잡하지 않은 디자인
        5. 아이들이 칠하기 좋은 수준

        영어로 된 최적화된 프롬프트만 답변해주세요:`;

        return await this.callGeminiAPI(prompt);
    }

    async generateMultipleStylePrompts(optimizedPrompt) {
        const styles = [
            "simple black and white line art, thick outlines, coloring book style",
            "cartoon style line drawing, bold outlines, simple shapes",
            "minimalist line art, clean outlines, coloring page design"
        ];

        return styles.map(style => `${optimizedPrompt}, ${style}, white background, high contrast`);
    }

    async generateImagesWithFreeAPI(stylePrompts) {
        // 무료 이미지 생성 서비스 사용 (예: Pollinations AI)
        const images = [];
        
        for (const prompt of stylePrompts.slice(0, 3)) { // 최대 3개 이미지
            try {
                // Pollinations AI API 사용
                const encodedPrompt = encodeURIComponent(prompt);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}`;
                
                // 이미지 로드 확인
                const isValid = await this.checkImageLoad(imageUrl);
                if (isValid) {
                    images.push(imageUrl);
                }
            } catch (error) {
                console.warn('이미지 생성 실패:', error);
            }
        }

        if (images.length === 0) {
            throw new Error('이미지 생성에 실패했습니다.');
        }

        return images;
    }

    async callGeminiAPI(prompt) {
        const url = `${this.baseUrl}/gemini-pro:generateContent?key=${this.apiKey}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API 요청 실패: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('API 응답 형식이 올바르지 않습니다.');
        }
    }

    async checkImageLoad(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            const timeout = setTimeout(() => {
                resolve(false);
            }, 10000); // 10초 타임아웃
            
            img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
            };
            
            img.src = url;
        });
    }
}