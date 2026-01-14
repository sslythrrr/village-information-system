const AdminLogin = {
    modal: null,
    btn: null,
    closeBtn: null,

    init() {
        this.modal = document.getElementById('adminLoginModal');
        this.btn = document.getElementById('adminLoginBtn');
        this.closeBtn = document.getElementsByClassName('close')[0];

        if (!this.modal || !this.btn) return;

        this.btn.onclick = () => this.open();
        this.closeBtn.onclick = () => this.close();
        
        window.onclick = (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        };

        this.setupForm();
    },

    open() {
        this.modal.style.display = 'block';
        document.body.classList.add('modal-open');
    },

    close() {
        this.modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    },

    setupForm() {
        const form = document.getElementById('adminLoginForm');
        if (!form) return;

        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    this.close();
                    window.location.reload();
                } else {
                    this.showMessage(data.message || 'Login gagal', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                this.showMessage('Terjadi kesalahan', 'error');
            }
        };
    },

    showMessage(message, type) {
        const messageEl = document.getElementById('loginMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.style.color = type === 'error' ? '#ff4444' : '#44ff44';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AdminLogin.init();
});
