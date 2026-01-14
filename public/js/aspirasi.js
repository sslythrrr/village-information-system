document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[action="/aspirasi"]');
    
    if (form) {
        const emailInput = form.querySelector('input[type="email"]');
        
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            if (emailInput && !validateEmail(emailInput.value)) {
                isValid = false;
                emailInput.classList.add('is-invalid');
            }

            if (!isValid) {
                e.preventDefault();
                alert('Mohon periksa kembali form Anda');
            }
        });

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    if (this.type === 'email') {
                        if (validateEmail(this.value)) {
                            this.classList.remove('is-invalid');
                        }
                    } else if (this.value.trim()) {
                        this.classList.remove('is-invalid');
                    }
                }
            });
        });
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
