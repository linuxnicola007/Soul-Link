// University Relationship Support Service - Main JavaScript

class UniversityRelationshipSupport {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all functionality
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupFormValidation();
        this.setupScrollAnimations();
        this.setupToastNotifications();
    }

    // Mobile Menu Toggle
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navClose = document.getElementById('nav-close');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.add('show');
            });
        }

        if (navClose) {
            navClose.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        }

        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        });
    }

    // Smooth Scrolling for Anchor Links
    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll to specific section
    scrollToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Form Validation and Submission
    setupFormValidation() {
        const form = document.getElementById('case-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                this.submitForm(form);
            }
        });

        // Real-time validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Check terms acceptance
        const termsCheckbox = form.querySelector('#terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            this.showToast('Please accept the terms and conditions', 'error');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Skip validation if anonymous and field is not description
        const anonymousCheckbox = document.getElementById('anonymous');
        if (anonymousCheckbox && anonymousCheckbox.checked && field.id !== 'description') {
            field.classList.remove('error');
            return true;
        }

        switch (field.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
            case 'tel':
                if (!this.isValidPhone(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;
            default:
                if (field.required && !value) {
                    errorMessage = 'This field is required';
                    isValid = false;
                } else if (field.id === 'description' && value.length < 10) {
                    errorMessage = 'Please provide more details (at least 10 characters)';
                    isValid = false;
                }
        }

        // Update field styling
        if (!isValid) {
            field.classList.add('error');
            this.showToast(errorMessage, 'error');
        } else {
            field.classList.remove('error');
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // Form Submission with Mock API
    async submitForm(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        try {
            // Show loading state
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            // Mock API call - Replace with actual endpoint
            const response = await this.mockApiCall('/api/submit-case', {
                method: 'POST',
                body: formData
            });

            if (response.success) {
                this.showToast('Case submitted successfully! We\'ll contact you soon.', 'success');
                form.reset();
                
                // Show confirmation modal (simplified)
                setTimeout(() => {
                    this.showToast('Our team will review your case and contact you within 24 hours.', 'success');
                }, 2000);
            } else {
                throw new Error(response.message || 'Submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showToast('Failed to submit case. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    // Mock API Call - Replace with actual fetch to backend
    async mockApiCall(endpoint, options) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate successful response
        return {
            success: true,
            message: 'Case submitted successfully',
            caseId: 'CASE_' + Date.now()
        };

        // For actual implementation, uncomment and modify:
        /*
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Accept': 'application/json',
                    // 'Authorization': 'Bearer ' + your_auth_token
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(HTTP error! status: ${response.status});
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
        */
    }

    // Scroll Animations with Intersection Observer
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all sections with fade-in class
        const sections = document.querySelectorAll('.section, .hero, .feature_card, .servicecard, .partnercard, .pricing_card');
        sections.forEach(section => {
            section.classList.add('fade-in');
            observer.observe(section);
        });
    }

    // Toast Notification System
    setupToastNotifications() {
        // Toast container is already in HTML
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = toast ${type} show;

        // Auto hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    // Payment Integration Placeholder
    initializePayment(amount, serviceType, expertId) {
        // Placeholder for payment integration
        // Implement based on chosen payment gateway (easypaisa/jazzcash/Stripe)
        
        console.log('Initializing payment:', { amount, serviceType, expertId });
        
        // Example structure for payment implementation:
        /*
        const paymentConfig = {
            amount: amount,
            currency: 'USD',
            serviceType: serviceType,
            expertId: expertId,
            // Add other necessary fields
        };

        // For Stripe:
        // this.initializeStripePayment(paymentConfig);
        
        // For EasyPaisa:
        // this.initializeEasyPaisaPayment(paymentConfig);
        
        // For JazzCash:
        // this.initializeJazzCashPayment(paymentConfig);
        */

        this.showToast('Payment integration placeholder - implement based on chosen gateway', 'warning');
    }

    // Example payment method stubs
    initializeStripePayment(config) {
        // Replace with actual Stripe implementation
        // Required: Stripe publishable key from environment variables
        /*
        const stripe = Stripe('pk_test_your_publishable_key_here');
        
        stripe.redirectToCheckout({
            lineItems: [{ price: config.priceId, quantity: 1 }],
            mode: 'payment',
            successUrl: ${window.location.origin}/success,
            cancelUrl: ${window.location.origin}/cancel
        });
        */
    }

    initializeEasyPaisaPayment(config) {
        // Replace with actual EasyPaisa implementation
        // Required: Merchant credentials and secure transaction handling
        /*
        const easypaisaConfig = {
            storeId: 'your_store_id',
            amount: config.amount,
            postBackURL: ${window.location.origin}/api/payment-callback
        };
        */
    }

    initializeJazzCashPayment(config) {
        // Replace with actual JazzCash implementation
        // Required: Merchant credentials and secure transaction handling
        /*
        const jazzcashConfig = {
            pp_MerchantID: 'your_merchant_id',
            pp_Amount: config.amount * 100, // in paisa
            pp_Description: Relationship Support - ${config.serviceType}
        };
        */
    }

    // Utility function for API calls with error handling
    async makeApiCall(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(HTTP error! status: ${response.status});
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            this.showToast('Service temporarily unavailable. Please try again.', 'error');
            throw error;
        }
    }

    // Rate limiting helper (client-side basic protection)
    setupRateLimiting(action, delay = 1000) {
        let lastCall = 0;
        
        return function(...args) {
            const now = Date.now();
            if (now - lastCall < delay) {
                this.showToast('Please wait before trying again', 'warning');
                return;
            }
            lastCall = now;
            return action.apply(this, args);
        }.bind(this);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new UniversityRelationshipSupport();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversityRelationshipSupport;
}

// Service Worker Registration (Optional - for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error boundary for unhandled errors
window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error);
    // You might want to send this to an error tracking service
});

// Performance monitoring
window.addEventListener('load', () => {
    // Basic performance metrics
    if ('performance' in window) {
        const navTiming = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', navTiming.loadEventEnd - navTiming.navigationStart);
    }
});

//adding dark theme
