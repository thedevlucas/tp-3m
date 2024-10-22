document.getElementById('image').addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onloadend = function() {
        document.getElementById('img').value = reader.result;
    };
    if (file) {
        reader.readAsDataURL(file);
    }
});

const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];
    
    if (file && file.size > 10 * 1024 * 1024) {
        alert('La imagen debe ser de 10mb o menos.');
        return;
    }

    document.getElementById('image').disabled = true;

    form.submit();
});