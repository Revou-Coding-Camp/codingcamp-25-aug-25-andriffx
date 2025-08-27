// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeClock();
    initializeNavigation();
    initializeForm();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeDynamicName();
});

// Real-time clock functionality
function initializeClock() {
    const currentTimeElement = document.getElementById('currentTime');
    
    function updateTime() {
        const now = new Date();
        const timeString = `Current time: ${now.toString()}`;
        currentTimeElement.textContent = timeString;
    }
    
    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active navigation based on scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Dynamic name functionality
function initializeDynamicName() {
    const userNameElement = document.getElementById('userName');
    
    // Get user name from localStorage or prompt
    let userName = localStorage.getItem('userName');
    
    if (!userName) {
        userName = prompt('Masukkan nama Anda:', 'Andri');
        if (userName && userName.trim()) {
            localStorage.setItem('userName', userName.trim());
        } else {
            userName = 'Andri'; // Default name
        }
    }
    
    // Update the welcome message
    userNameElement.textContent = userName;
    
    // Add typing animation effect
    userNameElement.style.opacity = '0';
    setTimeout(() => {
        userNameElement.style.transition = 'opacity 0.5s ease-in';
        userNameElement.style.opacity = '1';
    }, 1000);
}

// Form functionality with enhanced validation
function initializeForm() {
    const messageForm = document.getElementById('messageForm');
    const submittedMessage = document.getElementById('submittedMessage');
    
    // Add real-time validation
    const formInputs = messageForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showErrorMessage('Mohon lengkapi semua field yang diperlukan');
            return;
        }
        
        // Get form data
        const formData = new FormData(this);
        const nama = formData.get('nama');
        const tanggalLahir = formData.get('tanggalLahir');
        const jenisKelamin = formData.get('jenisKelamin');
        const pesan = formData.get('pesan');
        
        // Format date for display
        const formattedDate = formatDateForDisplay(tanggalLahir);
        
        // Update the submitted message display
        submittedMessage.innerHTML = `
            <div class="message-item">
                <strong>Nama:</strong> ${nama}
            </div>
            <div class="message-item">
                <strong>Tanggal Lahir:</strong> ${formattedDate}
            </div>
            <div class="message-item">
                <strong>Jenis Kelamin:</strong> ${jenisKelamin}
            </div>
            <div class="message-item">
                <strong>Pesan:</strong> ${pesan}
            </div>
        `;
        
        // Add success animation
        submittedMessage.style.animation = 'none';
        submittedMessage.offsetHeight; // Trigger reflow
        submittedMessage.style.animation = 'fadeInUp 0.5s ease-out';
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        this.reset();
        
        // Set default date
        document.getElementById('tanggalLahir').value = '2023-04-02';
        document.querySelector('input[name="jenisKelamin"][value="Laki-Laki"]').checked = true;
        
        // Clear any error messages
        clearAllFieldErrors();
    });
}

// Field validation function
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    clearFieldError(field);
    
    // Check if field is required
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Field ini wajib diisi';
    }
    
    // Specific validation for different field types
    if (field.type === 'text' && field.id === 'nama') {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Nama minimal 2 karakter';
        }
    }
    
    if (field.type === 'date') {
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) {
            isValid = false;
            errorMessage = 'Tanggal lahir tidak boleh di masa depan';
        }
    }
    
    if (field.tagName === 'TEXTAREA') {
        if (value.length < 10) {
            isValid = false;
            errorMessage = 'Pesan minimal 10 karakter';
        }
    }
    
    // Apply error styling if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    field.style.backgroundColor = '#fef2f2';
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 4px;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.backgroundColor = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Clear all field errors
function clearAllFieldErrors() {
    const errorDivs = document.querySelectorAll('.field-error');
    errorDivs.forEach(div => div.remove());
    
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
    });
}

// Show error message
function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Format date for display
function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Show success message
function showSuccessMessage() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Pesan berhasil dikirim!</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scrolling for all internal links
function initializeSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Initialize animations and interactions
function initializeAnimations() {
    // Add hover effects to location items
    const locationItems = document.querySelectorAll('.location-item');
    
    locationItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add form input animations
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Add button click effects
    const buttons = document.querySelectorAll('.submit-btn, .nav-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Browser interface interactions
document.addEventListener('DOMContentLoaded', function() {
    // Browser control buttons (visual only)
    const controlBtns = document.querySelectorAll('.control-btn');
    
    controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Navigation buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add visual feedback
            this.style.background = '#e2e8f0';
            setTimeout(() => {
                this.style.background = '';
            }, 200);
        });
    });
});

// Add loading animation for page elements
window.addEventListener('load', function() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.8s ease-out';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.location-item, .contact-form, .message-display');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close any open modals or focus
    if (e.key === 'Escape') {
        document.activeElement.blur();
    }
    
    // Enter key on form inputs
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const form = e.target.closest('form');
        if (form) {
            const submitBtn = form.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }
});

// Add touch support for mobile devices
document.addEventListener('touchstart', function() {}, {passive: true});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);
