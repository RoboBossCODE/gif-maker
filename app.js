const imageInput = document.getElementById('imageInput');
const delayInput = document.getElementById('delayInput');
const delayVal = document.getElementById('delayVal');
const generateBtn = document.getElementById('generateBtn');
const previewContainer = document.getElementById('previewContainer');
const gifPreview = document.getElementById('gifPreview');
const downloadBtn = document.getElementById('downloadBtn');

let imageFiles = [];

// Dynamically updates text when user changes speed slider
delayInput.addEventListener('input', (e) => {
    delayVal.textContent = `${e.target.value}s`;
});

// Protect button safety rules: unlock only when photos exist
imageInput.addEventListener('change', (e) => {
    imageFiles = Array.from(e.target.files);
    generateBtn.disabled = imageFiles.length === 0;
});

generateBtn.addEventListener('click', () => {
    if (imageFiles.length === 0) return;
    
    generateBtn.textContent = 'Processing...';
    generateBtn.disabled = true;

    // Convert local files securely to browser URLs
    const filePromises = imageFiles.map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    });

    Promise.all(filePromises).then(imageUrls => {
        // Runs the underlying engine to process frames
        gifshot.createGIF({
            images: imageUrls,
            interval: parseFloat(delayInput.value),
            numWorkers: 2,
            gifWidth: 400,
            gifHeight: 400
        }, function (obj) {
            if (!obj.error) {
                const imageSrc = obj.image;
                
                gifPreview.src = imageSrc;
                downloadBtn.href = imageSrc;
                downloadBtn.download = `custom-whatsapp-${Date.now()}.gif`;
                
                previewContainer.classList.remove('hidden');
            } else {
                alert('Something went wrong. Try using fewer images or standard JPG/PNG files.');
            }
            generateBtn.textContent = 'Generate GIF';
            generateBtn.disabled = false;
        });
    });
});
