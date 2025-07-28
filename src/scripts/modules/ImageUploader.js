export class ImageUploader {
    constructor() {
        this.onImageLoaded = null;
        this.init();
    }

    init() {
        this.setupFileInput();
        this.setupDragAndDrop();
    }

    setupFileInput() {
        const fileInput = document.getElementById('fileInput');
        const uploadBox = document.getElementById('uploadBox');

        if (uploadBox) {
            uploadBox.addEventListener('click', () => {
                fileInput.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFile(file);
                }
            });
        }
    }

    setupDragAndDrop() {
        const uploadBox = document.getElementById('uploadBox');

        if (!uploadBox) return;

        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('dragover');
        });

        uploadBox.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('dragover');
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
    }

    handleFile(file) {
        // 파일 타입 검증
        if (!this.isValidImageFile(file)) {
            alert('지원하지 않는 파일 형식입니다. JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다.');
            return;
        }

        // 파일 크기 검증 (10MB 제한)
        if (file.size > 10 * 1024 * 1024) {
            alert('파일 크기가 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.');
            return;
        }

        this.loadImageFromFile(file);
    }

    isValidImageFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        return validTypes.includes(file.type.toLowerCase());
    }

    loadImageFromFile(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                if (this.onImageLoaded) {
                    this.onImageLoaded(img);
                }
            };
            
            img.onerror = () => {
                alert('이미지 로드에 실패했습니다.');
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            alert('파일 읽기에 실패했습니다.');
        };
        
        reader.readAsDataURL(file);
    }
}