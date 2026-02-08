// Retro Interactive Blog - JavaScript
// Makes the minimalist design come alive with interactions

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initWidgetToggle();
        initTypewriterEffect();
        initScanlineToggle();
        initEasterEggs();
        initScrollEffects();
        consoleGreeting();
    });

    // Widget Toggle Functionality
    function initWidgetToggle() {
        const widgets = document.querySelectorAll('.widget');
        
        widgets.forEach(widget => {
            // Start collapsed
            const content = widget.querySelector('.widget-content');
            if (content) {
                widget.classList.remove('expanded');
            }
            
            widget.addEventListener('click', function(e) {
                // Don't toggle if clicking on a link
                if (e.target.tagName === 'A') return;
                
                this.classList.toggle('expanded');
                
                // Add a subtle click effect
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
        });
    }

    // Typewriter Effect for Title
    function initTypewriterEffect() {
        const title = document.querySelector('.site-title');
        if (!title) return;

        const text = title.textContent;
        title.textContent = '';
        title.setAttribute('data-text', text);
        
        let index = 0;
        
        function type() {
            if (index < text.length) {
                title.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            } else {
                title.classList.add('glitch');
            }
        }
        
        // Start typing after a short delay
        setTimeout(type, 500);
    }

    // Toggle Scanline Effect
    function initScanlineToggle() {
        let scanlineActive = false;
        const body = document.body;
        
        // Toggle with 'S' key
        document.addEventListener('keydown', function(e) {
            if (e.key === 's' || e.key === 'S') {
                scanlineActive = !scanlineActive;
                if (scanlineActive) {
                    body.classList.add('scanlines');
                    showNotification('Scanlines: ON');
                } else {
                    body.classList.remove('scanlines');
                    showNotification('Scanlines: OFF');
                }
            }
        });
    }

    // Easter Eggs
    function initEasterEggs() {
        // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                           'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', function(e) {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    activateMatrixMode();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });

        // Double-click on header to expand all widgets
        const header = document.querySelector('.site-header');
        if (header) {
            header.addEventListener('dblclick', function() {
                const widgets = document.querySelectorAll('.widget');
                const allExpanded = Array.from(widgets).every(w => w.classList.contains('expanded'));
                
                widgets.forEach(widget => {
                    if (allExpanded) {
                        widget.classList.remove('expanded');
                    } else {
                        widget.classList.add('expanded');
                    }
                });
                
                showNotification(allExpanded ? 'Widgets Collapsed' : 'Widgets Expanded');
            });
        }
    }

    // Matrix Mode Easter Egg
    function activateMatrixMode() {
        showNotification('MATRIX MODE ACTIVATED!');
        document.body.style.transition = 'all 2s ease';
        document.documentElement.style.setProperty('--retro-bg', '#000');
        document.documentElement.style.setProperty('--retro-accent', '#0f0');
        document.documentElement.style.setProperty('--retro-secondary', '#0f0');
        document.body.classList.add('scanlines');
        
        // Reset after 10 seconds
        setTimeout(() => {
            document.documentElement.style.setProperty('--retro-bg', '#0a0a0a');
            document.documentElement.style.setProperty('--retro-accent', '#00ff41');
            document.documentElement.style.setProperty('--retro-secondary', '#ffb000');
            showNotification('Normal Mode Restored');
        }, 10000);
    }

    // Scroll Effects
    function initScrollEffects() {
        const posts = document.querySelectorAll('.blog-post');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });
        
        posts.forEach(post => {
            observer.observe(post);
        });
    }

    // Show Notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--retro-bg);
            color: var(--retro-accent);
            padding: 1rem 2rem;
            border: 2px solid var(--retro-accent);
            font-family: 'Courier New', monospace;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Console Greeting
    function consoleGreeting() {
        const styles = [
            'color: #00ff41',
            'background: #0a0a0a',
            'font-size: 16px',
            'padding: 10px',
            'font-family: monospace'
        ].join(';');
        
        console.log('%c Welcome to the Retro Blog! ', styles);
        console.log('%c Try pressing "S" to toggle scanlines! ', styles);
        console.log('%c Double-click the header to expand/collapse all widgets ', styles);
        console.log('%c There might be more secrets hidden... ', styles);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

})();
