export class ColoringBookProcessor {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    async processImage(image, options = {}) {
        const {
            threshold = 128,
            blur = 2,
            lineWidth = 2,
            invert = false
        } = options;

        // 캔버스 크기 설정
        this.canvas.width = image.width;
        this.canvas.height = image.height;

        // 이미지 그리기
        this.ctx.drawImage(image, 0, 0);

        // 이미지 데이터 가져오기
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // 처리 단계
        let processedData = this.applyGaussianBlur(imageData, blur);
        processedData = this.convertToGrayscale(processedData);
        processedData = this.detectEdges(processedData, threshold);
        processedData = this.applyLineWidth(processedData, lineWidth);
        
        if (invert) {
            processedData = this.invertColors(processedData);
        }

        // 결과 캔버스에 적용
        this.ctx.putImageData(processedData, 0, 0);

        return this.canvas;
    }

    convertToGrayscale(imageData) {
        const data = new Uint8ClampedArray(imageData.data);
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            data[i] = gray;     // Red
            data[i + 1] = gray; // Green
            data[i + 2] = gray; // Blue
            // Alpha 채널은 그대로 유지
        }

        return new ImageData(data, imageData.width, imageData.height);
    }

    applyGaussianBlur(imageData, radius) {
        if (radius <= 0) return imageData;

        const width = imageData.width;
        const height = imageData.height;
        const data = new Uint8ClampedArray(imageData.data);
        const output = new Uint8ClampedArray(data.length);

        // 간단한 박스 블러 구현 (가우시안 블러의 근사)
        const kernelSize = Math.ceil(radius * 2) + 1;
        const kernel = [];
        let kernelSum = 0;

        // 커널 생성
        for (let i = 0; i < kernelSize; i++) {
            const x = i - Math.floor(kernelSize / 2);
            const value = Math.exp(-(x * x) / (2 * radius * radius));
            kernel[i] = value;
            kernelSum += value;
        }

        // 커널 정규화
        for (let i = 0; i < kernelSize; i++) {
            kernel[i] /= kernelSum;
        }

        // 수평 블러
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;

                for (let i = 0; i < kernelSize; i++) {
                    const sampleX = Math.min(Math.max(x + i - Math.floor(kernelSize / 2), 0), width - 1);
                    const idx = (y * width + sampleX) * 4;
                    const weight = kernel[i];

                    r += data[idx] * weight;
                    g += data[idx + 1] * weight;
                    b += data[idx + 2] * weight;
                    a += data[idx + 3] * weight;
                }

                const outputIdx = (y * width + x) * 4;
                output[outputIdx] = r;
                output[outputIdx + 1] = g;
                output[outputIdx + 2] = b;
                output[outputIdx + 3] = a;
            }
        }

        // 수직 블러
        const temp = new Uint8ClampedArray(output);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let r = 0, g = 0, b = 0, a = 0;

                for (let i = 0; i < kernelSize; i++) {
                    const sampleY = Math.min(Math.max(y + i - Math.floor(kernelSize / 2), 0), height - 1);
                    const idx = (sampleY * width + x) * 4;
                    const weight = kernel[i];

                    r += temp[idx] * weight;
                    g += temp[idx + 1] * weight;
                    b += temp[idx + 2] * weight;
                    a += temp[idx + 3] * weight;
                }

                const outputIdx = (y * width + x) * 4;
                output[outputIdx] = r;
                output[outputIdx + 1] = g;
                output[outputIdx + 2] = b;
                output[outputIdx + 3] = a;
            }
        }

        return new ImageData(output, width, height);
    }

    detectEdges(imageData, threshold) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const output = new Uint8ClampedArray(data.length);

        // Sobel 필터
        const sobelX = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        
        const sobelY = [
            [-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]
        ];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gx = 0, gy = 0;

                // Sobel 연산
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4;
                        const gray = data[idx]; // 이미 그레이스케일이므로 R 채널만 사용

                        gx += gray * sobelX[ky + 1][kx + 1];
                        gy += gray * sobelY[ky + 1][kx + 1];
                    }
                }

                const magnitude = Math.sqrt(gx * gx + gy * gy);
                const edge = magnitude > threshold ? 0 : 255; // 엣지는 검은색, 나머지는 흰색

                const outputIdx = (y * width + x) * 4;
                output[outputIdx] = edge;
                output[outputIdx + 1] = edge;
                output[outputIdx + 2] = edge;
                output[outputIdx + 3] = 255;
            }
        }

        // 가장자리 픽셀 처리
        for (let i = 0; i < data.length; i += 4) {
            if (output[i + 3] === 0) { // 아직 처리되지 않은 픽셀
                output[i] = 255;
                output[i + 1] = 255;
                output[i + 2] = 255;
                output[i + 3] = 255;
            }
        }

        return new ImageData(output, width, height);
    }

    applyLineWidth(imageData, lineWidth) {
        if (lineWidth <= 1) return imageData;

        const width = imageData.width;
        const height = imageData.height;
        const data = new Uint8ClampedArray(imageData.data);
        const output = new Uint8ClampedArray(data.length);

        // 모든 픽셀을 흰색으로 초기화
        for (let i = 0; i < output.length; i += 4) {
            output[i] = 255;
            output[i + 1] = 255;
            output[i + 2] = 255;
            output[i + 3] = 255;
        }

        // 검은 픽셀 주변에 선 굵기만큼 검은 픽셀 추가
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                
                if (data[idx] === 0) { // 검은 픽셀인 경우
                    // 주변 픽셀들을 검은색으로 칠하기
                    for (let dy = -lineWidth; dy <= lineWidth; dy++) {
                        for (let dx = -lineWidth; dx <= lineWidth; dx++) {
                            const newX = x + dx;
                            const newY = y + dy;
                            
                            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                                if (dx * dx + dy * dy <= lineWidth * lineWidth) {
                                    const newIdx = (newY * width + newX) * 4;
                                    output[newIdx] = 0;
                                    output[newIdx + 1] = 0;
                                    output[newIdx + 2] = 0;
                                    output[newIdx + 3] = 255;
                                }
                            }
                        }
                    }
                }
            }
        }

        return new ImageData(output, width, height);
    }

    invertColors(imageData) {
        const data = new Uint8ClampedArray(imageData.data);
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];       // Red
            data[i + 1] = 255 - data[i + 1]; // Green
            data[i + 2] = 255 - data[i + 2]; // Blue
            // Alpha는 그대로 유지
        }

        return new ImageData(data, imageData.width, imageData.height);
    }
}