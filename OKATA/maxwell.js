 // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if(targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Gallery Filtering
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        // Form submission handler
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('form-status');
        const submitText = document.getElementById('submit-text');
        const submitSpinner = document.getElementById('submit-spinner');
        
        // Copy to clipboard function
        function copyToClipboard(text, elementId) {
            navigator.clipboard.writeText(text).then(() => {
                const element = document.getElementById(elementId);
                const originalText = element.textContent;
                element.innerHTML = '<span style="color: var(--success);"><i class="fas fa-check"></i> Copied!</span>';
                
                setTimeout(() => {
                    element.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
        
        // Form submission with Formspree
        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Show loading state
                submitText.style.display = 'none';
                submitSpinner.style.display = 'inline';
                
                // Get form data
                const formData = new FormData(this);
                
                try {
                    // Send to Formspree
                    const response = await fetch(this.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        // Success - reset form and show success message
                        this.reset();
                        formStatus.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <i class="fas fa-check-circle" style="font-size: 1.5rem; color: var(--success);"></i>
                                <div>
                                    <strong>Message Sent Successfully!</strong><br>
                                    Maxwell has received your message and will respond within 24 hours.
                                </div>
                            </div>
                        `;
                        formStatus.className = 'form-status success';
                        
                        // You can add a redirect here if you want:
                        // window.location.href = '/thank-you.html';
                        
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Form submission failed');
                    }
                    
                } catch (error) {
                    console.error('Form submission error:', error);
                    
                    // Show error message with alternative contact methods
                    formStatus.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; color: var(--error);"></i>
                            <div>
                                <strong>Unable to send form.</strong><br>
                                Please contact Maxwell directly:<br>
                                • Email: <a href="mailto:maxwell.okata@ucc.edu.gh" style="color: var(--primary);">maxwell.okata@ucc.edu.gh</a><br>
                                • WhatsApp: <a href="https://wa.me/233241234567" style="color: var(--primary);">+233 24 123 4567</a>
                            </div>
                        </div>
                    `;
                    formStatus.className = 'form-status error';
                    
                } finally {
                    // Reset button state
                    submitText.style.display = 'inline';
                    submitSpinner.style.display = 'none';
                    
                    // Scroll to form status for visibility
                    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }
        
        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if(window.scrollY > 100) {
                header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
        
        // Check if Formspree ID is still placeholder
        window.addEventListener('load', function() {
            const form = document.getElementById('contactForm');
            if (form && form.action.includes('YOUR_FORMSPREE_ID')) {
                const status = document.getElementById('form-status');
                status.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-exclamation-circle" style="font-size: 1.5rem; color: var(--accent);"></i>
                        <div>
                            <strong>Form Not Yet Configured</strong><br>
                            To receive messages, Maxwell needs to:<br>
                            1. Go to <a href="https://formspree.io" target="_blank" style="color: var(--primary);">formspree.io</a><br>
                            2. Sign up and get Form ID<br>
                            3. Replace "YOUR_FORMSPREE_ID" in the form action<br><br>
                            <em>For now, please use the contact details on the left.</em>
                        </div>
                    </div>
                `;
                status.className = 'form-status info';
            }
        });