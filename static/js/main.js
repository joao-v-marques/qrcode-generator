(function () {
    const DEFAULTS = {
        fillColor: '#000000',
        backColor: '#ffffff',
        size: 'medium',
        border: 4,
    };

    const form = document.getElementById('qrcode-form');
    const linkInput = document.getElementById('link-input');
    const generateBtn = document.getElementById('generate-btn');
    const errorMessage = document.getElementById('error-message');
    const result = document.getElementById('result');
    const resultPlaceholder = document.getElementById('result-placeholder');
    const qrcodeImage = document.getElementById('qrcode-image');
    const downloadLink = document.getElementById('download-link');

    const fillSwatchGroup = document.getElementById('fill-color-swatches');
    const backSwatchGroup = document.getElementById('back-color-swatches');
    const fillColorPicker = document.getElementById('fill-color-picker');
    const backColorPicker = document.getElementById('back-color-picker');
    const colorPreview = document.getElementById('color-preview');
    const borderInput = document.getElementById('border-input');
    const borderValue = document.getElementById('border-value');
    const resetBtn = document.getElementById('reset-customize');

    let selectedFillColor = DEFAULTS.fillColor;
    let selectedBackColor = DEFAULTS.backColor;

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

    function updateColorPreview() {
        colorPreview.style.setProperty('--color-preview-bg', selectedBackColor);
        colorPreview.style.setProperty('--color-preview-fill', selectedFillColor);
    }

    function setSwatchGroupSelection(group, color) {
        group.querySelectorAll('.swatch').forEach(function (swatch) {
            const isMatch = swatch.dataset.color.toLowerCase() === color.toLowerCase();
            swatch.setAttribute('aria-pressed', String(isMatch));
        });
    }

    function setFillColor(color) {
        selectedFillColor = color;
        fillColorPicker.value = color;
        setSwatchGroupSelection(fillSwatchGroup, color);
        updateColorPreview();
    }

    function setBackColor(color) {
        selectedBackColor = color;
        backColorPicker.value = color;
        setSwatchGroupSelection(backSwatchGroup, color);
        updateColorPreview();
    }

    fillSwatchGroup.addEventListener('click', function (event) {
        const swatch = event.target.closest('.swatch');
        if (!swatch) return;
        setFillColor(swatch.dataset.color);
    });

    backSwatchGroup.addEventListener('click', function (event) {
        const swatch = event.target.closest('.swatch');
        if (!swatch) return;
        setBackColor(swatch.dataset.color);
    });

    fillColorPicker.addEventListener('input', function () {
        setFillColor(fillColorPicker.value);
    });

    backColorPicker.addEventListener('input', function () {
        setBackColor(backColorPicker.value);
    });

    borderInput.addEventListener('input', function () {
        borderValue.textContent = borderInput.value;
    });

    resetBtn.addEventListener('click', function () {
        setFillColor(DEFAULTS.fillColor);
        setBackColor(DEFAULTS.backColor);
        document.getElementById('size-medium').checked = true;
        borderInput.value = DEFAULTS.border;
        borderValue.textContent = String(DEFAULTS.border);
    });

    updateColorPreview();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        hideError();

        const link = linkInput.value.trim();
        if (!link) {
            showError('Informe um link para gerar o QR Code.');
            result.hidden = true;
            resultPlaceholder.hidden = false;
            return;
        }

        if (selectedFillColor.toLowerCase() === selectedBackColor.toLowerCase()) {
            showError('A cor do QR Code e a cor de fundo não podem ser iguais.');
            result.hidden = true;
            resultPlaceholder.hidden = false;
            return;
        }

        const size = form.querySelector('input[name="size"]:checked').value;
        const border = Number(borderInput.value);

        setLoading(true);

        try {
            const response = await fetch('/api/qrcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    link,
                    fill_color: selectedFillColor,
                    back_color: selectedBackColor,
                    size,
                    border,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Não foi possível gerar o QR Code.');
            }

            qrcodeImage.src = data.image;
            downloadLink.href = data.image;
            resultPlaceholder.hidden = true;
            result.hidden = false;
        } catch (error) {
            result.hidden = true;
            resultPlaceholder.hidden = false;
            showError(error.message || 'Não foi possível gerar o QR Code. Tente novamente.');
        } finally {
            setLoading(false);
        }
    });
})();
