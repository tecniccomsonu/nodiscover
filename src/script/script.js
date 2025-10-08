class ApostilaApp {
    constructor() {
        this.currentPage = 'home';
        this.currentTheme = 'dark';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTabs();
        this.setupDonationModal();
        this.loadApostilas();
        this.setupAutoHideNavbar();
        this.setupPdModal();
        this.showToast("Apostilas do 4° Bimestre já disponíveis!");
    }

    setupNavigation() {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
    }

    navigateTo(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        const targetPage = document.getElementById(page + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
        }

        document.querySelectorAll(`[data-page="${page}"]`).forEach(l => {
            l.classList.add('active');
        });
    }

    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');

                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(tab)?.classList.add('active');
            });
        });
    }

    setupDonationModal() {
        const modal = document.getElementById('donationModal');
        const openBtn = document.getElementById('openDonationModal');
        const closeBtn = document.getElementById('closeDonationModal');

        if (openBtn) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal?.classList.add('active');
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal?.classList.remove('active');
            });
        }

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    setupPdModal() {
        const modal = document.getElementById('donationModal');
        const openBtn = document.getElementById('closeDonationModal');

        modal?.classList.add('active');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal?.classList.remove('active');
            });
        }

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }


    async loadApostilas() {
        this.showLoading();

        try {
            const response = await fetch('https://books-api-blush.vercel.app/api/apostilas');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this.renderApostilas(data);
        } catch (error) {
            console.error('Erro ao carregar apostilas:', error);
            this.showError('Erro ao carregar apostilas. Tente novamente mais tarde.');
        }
    }

    setupAutoHideNavbar() {
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > lastScroll) {
                navbar.style.transform = 'translate(-50%, -150%)';
                navbar.style.opacity = '1';
            } else {
                navbar.style.transform = 'translate(-50%, 0)';
                navbar.style.opacity = '1';
            }

            lastScroll = currentScroll;
        });
    }

    showLoading() {
        const loadingHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text">Carregando apostilas...</p>
            </div>
        `;

        document.getElementById('ensino-fundamental').innerHTML = loadingHTML;
        document.getElementById('ensino-medio').innerHTML = loadingHTML;
    }

    renderApostilas(data) {
        this.renderGrades(data, 'ensino-fundamental', ['6ano', '7ano', '8ano', '9ano']);
        this.renderGrades(data, 'ensino-medio', ['1ano', '2ano', '3ano']);
    }

    renderGrades(data, containerId, gradeKeys) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const cards = gradeKeys.map(key => {
            if (!data[key]) return '';
            const grade = data[key];

            const volumes = Object.keys(grade.volumes || {}).map(volumeKey => {
                const volume = grade.volumes[volumeKey];
                const books = (volume.books || []).map(book => `
                    <a href="${book.url}" target="_blank" class="book-item">
                        <i class="fas fa-file-pdf"></i>
                        <span>${book.title}</span>
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                `).join('');

                return `
                    <div class="volume-section">
                        <h4 class="volume-title">${volume.title}</h4>
                        <div class="books-list">${books}</div>
                    </div>
                `;
            }).join('');

            return `
                <div class="grade-card">
                    <div class="grade-header">
                        <div class="grade-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <h3>${grade.title}</h3>
                        <span class="grade-count">${grade.totalApostilas} apostilas</span>
                    </div>
                    ${volumes}
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="grade-cards">${cards}</div>`;
    }

    showError(message) {
        document.getElementById('ensino-fundamental').innerHTML = `
            <div class="loading-container">
                <p class="loading-text" style="color: var(--error);">${message}</p>
            </div>
        `;
        document.getElementById('ensino-medio').innerHTML = `
            <div class="loading-container">
                <p class="loading-text" style="color: var(--error);">${message}</p>
            </div>
        `;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #090b15;
            color: #fff;
            padding: 15px 20px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            z-index: 9999;
        `;

        const icon = document.createElement('i');
        icon.className = `fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}`;
        toast.appendChild(icon);

        const text = document.createElement('span');
        text.textContent = message;
        toast.appendChild(text);

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            margin-left: 15px;
            cursor: pointer;
            font-weight: bold;
        `;
        closeBtn.onclick = () => {
            toast.style.opacity = 0;
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        };
        toast.appendChild(closeBtn);

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = 1;
            toast.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = 0;
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new ApostilaApp();
});
