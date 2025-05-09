document.addEventListener('DOMContentLoaded', () => {
    const joinButton = document.querySelector('.joinbutton button')
    const formulirSection = document.getElementById('formulir');

    // Buat initial CSS
    formulirSection.style.cssText = `
        opacity: 0;
        visibility: hidden;
        transform: translateY(-20px);
        transition: opacity 0.5s ease, transform 0.5s ease, visibility 0.5s;
    `;

    joinButton.addEventListener('click', () => {
        // Show formulir
        formulirSection.removeAttribute('hidden');
        
        // memastikan transisi working
        void formulirSection.offsetWidth;
        
        //buat stylenya visible
        formulirSection.style.opacity = '1';
        formulirSection.style.visibility = 'visible';
        formulirSection.style.transform = 'translateY(0)';

        // Scroll langsung ke formulir
        formulirSection.scrollIntoView({
            behavior: 'smooth', // smooth scrolling
            block: 'start'
        });
    }); 

    const submitButton = document.getElementById('submit');
    if (submitButton) { 
        submitButton.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            // Validasi
            const nameInput = document.getElementById('nama');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('telp');
            const tierSelected = document.querySelector('input[name="Tier"]:checked');
            const termsAccepted = document.getElementById('accept');


            if (!nameInput || !nameInput.value.trim()) {
                alert('Silakan masukkan nama Anda');
                return;
            }

            if (!emailInput || !emailInput.value.trim() || !emailInput.value.includes('@')) {
                alert('Silakan masukkan email yang valid');
                return;
            }

            if (!phoneInput || !phoneInput.value.trim()) {
                alert('Silakan masukkan nomor telepon');
                return;
            }

            if (!tierSelected) {
                alert('Silakan pilih tier membership');
                return;
            }

            if (!termsAccepted || !termsAccepted.checked) {
                alert('Anda harus menyetujui Syarat & Ketentuan');
                return;
            }
 
            // Log input values
            console.log('Name:', nameInput.value);
            console.log('Email:', emailInput.value);
            console.log('Phone:', phoneInput.value);
            console.log('Tier:', tierSelected.value);
            console.log('Terms Accepted:', termsAccepted.checked);
 
            // Semua telah divalidasi
            alert('Pendaftaran berhasil! Kami akan segera menghubungi Anda.');
            
            // Hide formulir
            formulirSection.style.opacity = '0';
            formulirSection.style.visibility = 'hidden';
            formulirSection.style.transform = 'translateY(-20px)';
            
            // Reset
            const form = event.target.closest('form');
            if (form) {
                form.reset();
                location.reload();
            }
        });
    }
}); 

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');
    const navItems = document.querySelectorAll('.nav-links a');
    
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', toggleMenu);
    
    // Close menu when overlay is clicked
    overlay.addEventListener('click', toggleMenu);
    
    // Close menu when nav item is clicked
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Add additional style to prevent scrolling when menu is open
    document.head.insertAdjacentHTML('beforeend', 
        '<style>.no-scroll{overflow:hidden;}</style>'
    );
});