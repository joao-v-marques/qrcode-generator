(function () {
    const form = document.getElementById('qrcode-form');
    const linkInput = document.getElementById('link-input');
    const generateBtn = document.getElementById('generate-btn');
    const errorMessage = document.getElementById('error-message');
    const result = document.getElementById('result');
    const qrcodeImage = document.getElementById('qrcode-image');
    const downloadLink = document.getElementById('download-link');

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    }

    function hideError() {
        errorMessage.hidden = true;
        errorMessage.textContent = '';
    }

    function setLoading(isLoading) {
        generateBtn.disabled = isLoading;
        generateBtn.classList.toggle('is-loading', isLoading);
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        hideError();

        const link = linkInput.value.trim();
        if (!link) {
            showError('Informe um link para gerar o QR Code.');
            result.hidden = true;
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/qrcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Não foi possível gerar o QR Code.');
            }

            qrcodeImage.src = data.image;
            downloadLink.href = data.image;
            result.hidden = false;
        } catch (error) {
            result.hidden = true;
            showError(error.message || 'Não foi possível gerar o QR Code. Tente novamente.');
        } finally {
            setLoading(false);
        }
    });
})();
