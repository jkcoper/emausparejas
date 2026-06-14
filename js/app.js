/**
 * Emaús Parejas Ibagué - Intenciones de Oración
 * Main Application Logic
 */

// ========================================
// Access Code
// ========================================
const ACCESS_CODE = 'Emaus2026Parejas';

// ========================================
// Global Variables
// ========================================
let intentions = [];
let currentPageIndex = 0;
let pages = [];

// ========================================
// DOM Elements
// ========================================
const elements = {
    // Login
    loginSection: document.getElementById('loginSection'),
    loginForm: document.getElementById('loginForm'),
    accessCode: document.getElementById('accessCode'),
    loginError: document.getElementById('loginError'),

    // Cover
    coverSection: document.getElementById('coverSection'),
    openBookBtn: document.getElementById('openBookBtn'),

    // Notebook
    notebookSection: document.getElementById('notebookSection'),
    book: document.getElementById('book'),
    addIntentionBtn: document.getElementById('addIntentionBtn'),
    prevPageBtn: document.getElementById('prevPageBtn'),
    nextPageBtn: document.getElementById('nextPageBtn'),
    currentPage: document.getElementById('currentPage'),
    totalPages: document.getElementById('totalPages'),
    searchSelect: document.getElementById('searchSelect'),
    searchGoBtn: document.getElementById('searchGoBtn'),
    backToCoverBtn: document.getElementById('backToCoverBtn'),

    // Modal
    intentionModal: document.getElementById('intentionModal'),
    modalClose: document.getElementById('modalClose'),
    intentionForm: document.getElementById('intentionForm'),
    intentionInput: document.getElementById('intentionInput'),
    nameInput: document.getElementById('nameInput'),
    formDate: document.getElementById('formDate'),
    saveBtn: document.getElementById('saveBtn'),

    // Back Cover
    backCoverSection: document.getElementById('backCoverSection')
};

// ========================================
// Initialize App
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    checkAccess();
    initParticles();
    initEventListeners();
    loadIntentions();
    updateFormDate();
});

// ========================================
// Access Control
// ========================================
function checkAccess() {
    const isAuthorized = sessionStorage.getItem('emaus_access');
    if (isAuthorized === ACCESS_CODE) {
        showMainContent();
    }
}

function showMainContent() {
    elements.loginSection.classList.add('hidden');
    elements.coverSection.style.display = 'flex';
}

function handleLogin(e) {
    e.preventDefault();
    const code = elements.accessCode.value.trim();

    if (code === ACCESS_CODE) {
        sessionStorage.setItem('emaus_access', code);
        elements.loginError.textContent = '';
        showMainContent();
    } else {
        elements.loginError.textContent = 'Código incorrecto. Intentá de nuevo.';
        elements.accessCode.value = '';
        elements.accessCode.focus();

        // Shake animation
        elements.loginCard = document.querySelector('.login-card');
        elements.loginCard.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            elements.loginCard.style.animation = '';
        }, 500);
    }
}

// ========================================
// Particles Background
// ========================================
function initParticles() {
    const container = document.getElementById('particles');
    const symbols = ['✦', '✧', '✝', '❋', '✿', '☾', '☮', '⚘'];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        particle.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
        container.appendChild(particle);
    }
}

// ========================================
// Event Listeners
// ========================================
function initEventListeners() {
    // Login
    elements.loginForm.addEventListener('submit', handleLogin);

    // Open Book
    elements.openBookBtn.addEventListener('click', openBook);

    // Add Intention
    elements.addIntentionBtn.addEventListener('click', openModal);

    // Navigation
    elements.prevPageBtn.addEventListener('click', () => navigatePage(-1));
    elements.nextPageBtn.addEventListener('click', () => navigatePage(1));

    // Search
    elements.searchGoBtn.addEventListener('click', searchByAuthor);
    elements.searchSelect.addEventListener('change', (e) => {
        if (e.target.value) searchByAuthor();
    });

    // Back to Cover
    elements.backToCoverBtn.addEventListener('click', backToCover);

    // Modal
    elements.modalClose.addEventListener('click', closeModal);
    elements.intentionModal.addEventListener('click', (e) => {
        if (e.target === elements.intentionModal) closeModal();
    });

    // Form Submit
    elements.intentionForm.addEventListener('submit', handleFormSubmit);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (elements.intentionModal.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') navigatePage(-1);
        if (e.key === 'ArrowRight') navigatePage(1);
        if (e.key === 'Escape') closeModal();
    });
}

// ========================================
// Book Operations
// ========================================
function openBook() {
    elements.coverSection.style.display = 'none';
    elements.notebookSection.classList.add('active');
    buildPages();
    showPage(0);
}

function buildPages() {
    elements.book.innerHTML = '';
    pages = [];

    // Cover Page
    const coverPage = createCoverPage();
    elements.book.appendChild(coverPage);
    pages.push(coverPage);

    // Intention Pages
    intentions.forEach((intention, index) => {
        const page = createIntentionPage(intention, index);
        elements.book.appendChild(page);
        pages.push(page);
    });

    // Empty Page (for new intentions)
    const emptyPage = createEmptyPage();
    elements.book.appendChild(emptyPage);
    pages.push(emptyPage);

    // Back Cover
    const backCover = createBackCoverPage();
    elements.book.appendChild(backCover);
    pages.push(backCover);

    updatePageCounter();
    updateSearchSelect();
    updateNavButtons();
}

function createCoverPage() {
    const page = document.createElement('div');
    page.className = 'page cover-page visible';
    page.innerHTML = `
        <div class="page-decoration top-right"><i class="fas fa-cross"></i></div>
        <div class="page-decoration bottom-left"><i class="fas fa-cross"></i></div>
        <h2 class="page-title">Intenciones de Oración</h2>
        <p class="page-subtitle">Emaús Parejas Ibagué</p>
        <p style="font-family: var(--font-display); font-size: 1.2rem; margin-top: 2rem; color: var(--gold);">2026</p>
    `;
    return page;
}

function createIntentionPage(intention, index) {
    const page = document.createElement('div');
    page.className = 'page';
    page.setAttribute('data-id', intention.id);
    page.setAttribute('data-author', intention.nombre.toLowerCase());

    const date = intention.fecha ? new Date(intention.fecha.toDate()) : new Date();
    const formattedDate = date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    page.innerHTML = `
        <div class="page-decoration top-right"><i class="fas fa-dove"></i></div>
        <div class="page-decoration bottom-left"><i class="fas fa-heart"></i></div>
        <div class="intention-content">
            <p class="intention-text">"${intention.intencion}"</p>
            <p class="intention-author">— ${intention.nombre}</p>
            <p class="intention-date">${formattedDate}</p>
        </div>
    `;

    return page;
}

function createEmptyPage() {
    const page = document.createElement('div');
    page.className = 'page';
    page.innerHTML = `
        <div class="empty-page">
            <div class="empty-page-icon"><i class="fas fa-feather-alt"></i></div>
            <p class="empty-page-text">Escribí tu intención de oración</p>
            <p class="empty-page-subtext">Hacé clic en "Nueva Intención" para agregar la tuya</p>
        </div>
    `;
    return page;
}

function createBackCoverPage() {
    const page = document.createElement('div');
    page.className = 'page back-cover-page';
    page.innerHTML = `
        <div class="back-text">
            <p>"Lo que aquí se dice..."</p>
            <p style="font-size: 2.5rem; margin-top: 1rem;">"¡Aquí se queda!"</p>
        </div>
    `;
    return page;
}

// ========================================
// Page Navigation (Simple & Reliable)
// ========================================
function showPage(index) {
    if (index < 0 || index >= pages.length) return;

    pages.forEach((page, i) => {
        page.classList.remove('visible', 'slide-left', 'slide-right');
        if (i === index) {
            page.classList.add('visible');
        } else if (i < index) {
            page.classList.add('slide-left');
        } else {
            page.classList.add('slide-right');
        }
    });

    currentPageIndex = index;
    updatePageCounter();
    updateNavButtons();
}

function navigatePage(direction) {
    const newIndex = currentPageIndex + direction;
    if (newIndex >= 0 && newIndex < pages.length) {
        showPage(newIndex);
    }
}

function goToPage(pageNumber) {
    if (pageNumber >= 0 && pageNumber < pages.length) {
        showPage(pageNumber);
    }
}

function updatePageCounter() {
    elements.currentPage.textContent = currentPageIndex + 1;
    elements.totalPages.textContent = pages.length;
}

function updateNavButtons() {
    elements.prevPageBtn.style.opacity = currentPageIndex === 0 ? '0.5' : '1';
    elements.prevPageBtn.style.pointerEvents = currentPageIndex === 0 ? 'none' : 'auto';

    elements.nextPageBtn.style.opacity = currentPageIndex === pages.length - 1 ? '0.5' : '1';
    elements.nextPageBtn.style.pointerEvents = currentPageIndex === pages.length - 1 ? 'none' : 'auto';
}

// ========================================
// Search Functionality
// ========================================
function updateSearchSelect() {
    elements.searchSelect.innerHTML = '<option value="">Buscar intención por nombre...</option>';

    const uniqueAuthors = [...new Set(intentions.map(i => i.nombre))];

    uniqueAuthors.forEach((author) => {
        const option = document.createElement('option');
        option.value = author.toLowerCase();
        option.textContent = author;
        elements.searchSelect.appendChild(option);
    });
}

function searchByAuthor() {
    const searchTerm = elements.searchSelect.value.toLowerCase();
    if (!searchTerm) return;

    let foundIndex = -1;

    pages.forEach((page, index) => {
        const author = page.getAttribute('data-author');
        if (author === searchTerm && foundIndex === -1) {
            foundIndex = index;
        }
    });

    if (foundIndex !== -1) {
        showPage(foundIndex);

        // Highlight effect
        const page = pages[foundIndex];
        page.style.boxShadow = '0 0 30px 10px rgba(212, 168, 67, 0.7)';
        setTimeout(() => {
            page.style.boxShadow = '';
        }, 2000);
    } else {
        showToast('No se encontró intención de ese autor', 'error');
    }
}

// ========================================
// Modal Operations
// ========================================
function openModal() {
    elements.intentionModal.classList.add('active');
    elements.intentionInput.focus();
    elements.intentionForm.reset();
    updateFormDate();
}

function closeModal() {
    elements.intentionModal.classList.remove('active');
}

function updateFormDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    elements.formDate.textContent = now.toLocaleDateString('es-CO', options);
}

// ========================================
// Form Submission
// ========================================
async function handleFormSubmit(e) {
    e.preventDefault();

    const intention = elements.intentionInput.value.trim();
    const name = elements.nameInput.value.trim();

    if (!intention || !name) {
        showToast('Por favor completá todos los campos', 'error');
        return;
    }

    // Show loading
    const saveBtnText = elements.saveBtn.querySelector('.save-btn-text');
    const saveBtnIcon = elements.saveBtn.querySelector('.save-btn-icon');
    const saveBtnLoading = elements.saveBtn.querySelector('.save-btn-loading');

    saveBtnText.style.display = 'none';
    saveBtnIcon.style.display = 'none';
    saveBtnLoading.style.display = 'inline';
    elements.saveBtn.disabled = true;

    try {
        // Save to Firebase
        const docRef = await intencionesRef.add({
            intencion: intention,
            nombre: name,
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            pagina: intentions.length + 1
        });

        // Add to local array
        intentions.push({
            id: docRef.id,
            intencion: intention,
            nombre: name,
            fecha: { toDate: () => new Date() },
            pagina: intentions.length + 1
        });

        // Close modal
        closeModal();

        // Rebuild pages
        buildPages();

        // Navigate to the new page
        setTimeout(() => {
            goToPage(intentions.length); // +1 for cover
        }, 300);

        showToast('¡Intención guardada con éxito!', 'success');

    } catch (error) {
        console.error('Error saving intention:', error);
        showToast('Error al guardar. Intentá de nuevo.', 'error');
    } finally {
        // Reset button
        saveBtnText.style.display = 'inline';
        saveBtnIcon.style.display = 'inline';
        saveBtnLoading.style.display = 'none';
        elements.saveBtn.disabled = false;
    }
}

// ========================================
// Firebase Operations
// ========================================
async function loadIntentions() {
    try {
        const snapshot = await intencionesRef.orderBy('fecha', 'asc').get();

        intentions = [];
        snapshot.forEach(doc => {
            intentions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`Loaded ${intentions.length} intentions`);

    } catch (error) {
        console.error('Error loading intentions:', error);
        showToast('Error al cargar las intenciones', 'error');
    }
}

// ========================================
// Back to Cover
// ========================================
function backToCover() {
    elements.notebookSection.classList.remove('active');
    elements.coverSection.style.display = 'flex';
}

// ========================================
// Toast Notifications
// ========================================
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Hide
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
