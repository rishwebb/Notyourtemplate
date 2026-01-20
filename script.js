// Custom cursor
const cursor = document.createElement('div');
cursor.className = 'cursor-custom';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

// Glitch text scramble
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += char;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize scramble text
const scrambleElements = document.querySelectorAll('.scramble-char');
scrambleElements.forEach((el, index) => {
    el.style.setProperty('--i', index);
});

// Anti-navigation
document.querySelectorAll('.obscure-link').forEach(link => {
    link.addEventListener('click', function() {
        const section = document.getElementById(this.dataset.section);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Enter void button
document.querySelector('.anti-button').addEventListener('click', function() {
    this.style.transform = 'scale(0)';
    setTimeout(() => {
        document.getElementById('manifest').scrollIntoView({ behavior: 'smooth' });
        this.style.transform = '';
    }, 300);
});

// Glitch effect on hover
document.querySelectorAll('.glitch').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);
    });
});

// Tilt effect for debris items
document.querySelectorAll('[data-tilt]').forEach(element => {
    element.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Void form handling
const voidForm = document.querySelector('.void-form');
if (voidForm) {
    voidForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.void-submit');
        const submitText = submitBtn.querySelector('.submit-text');
        
        // Scramble submit text
        const scramble = new TextScramble(submitText);
        scramble.setText('TRANSMITTING...').then(() => {
            setTimeout(() => {
                scramble.setText('SIGNAL RECEIVED').then(() => {
                    setTimeout(() => {
                        scramble.setText('TRANSMIT');
                        this.reset();
                    }, 2000);
                });
            }, 2000);
        });
        
        // Visual feedback
        submitBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            submitBtn.style.transform = '';
        }, 200);
    });
}

// Random glitch events
function randomGlitch() {
    const elements = document.querySelectorAll('.glitch-text, .manifest-title, .void-title');
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    
    randomElement.style.animation = 'none';
    setTimeout(() => {
        randomElement.style.animation = '';
    }, 10);
}

setInterval(randomGlitch, 5000);

// Scroll reveal with chaos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Add random delay for chaos effect
            const items = entry.target.querySelectorAll('.grid-item, .debris-item');
            items.forEach((item, index) => {
                item.style.animationDelay = `${Math.random() * 0.5}s`;
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.manifest-section, .debris-section, .void-section').forEach(section => {
    observer.observe(section);
});

// Typing effect for footer
const footerText = document.querySelector('.footer-text');
const originalText = footerText.textContent;
let charIndex = 0;

function typeFooter() {
    if (charIndex < originalText.length) {
        footerText.textContent = originalText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeFooter, 50);
    } else {
        setTimeout(() => {
            footerText.textContent = '';
            charIndex = 0;
            typeFooter();
        }, 3000);
    }
}

// Start typing when footer is visible
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            typeFooter();
            footerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

footerObserver.observe(document.querySelector('.anti-footer'));

// Parallax effect for floating fragments
document.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const fragments = document.querySelectorAll('.fragment');
    
    fragments.forEach((fragment, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        fragment.style.transform = `translateY(${yPos}px) rotate(${yPos * 0.1}deg)`;
    });
});

// Random cursor glitch
function cursorGlitch() {
    cursor.style.borderColor = '#00ffff';
    cursor.style.boxShadow = '0 0 20px #00ffff';
    
    setTimeout(() => {
        cursor.style.borderColor = '';
        cursor.style.boxShadow = '';
    }, 100);
}

setInterval(cursorGlitch, 8000);

// Input field chaos effects
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.textShadow = '0 0 10px #ff006e';
    });
    
    input.addEventListener('blur', function() {
        this.style.textShadow = '';
    });
    
    input.addEventListener('input', function() {
        if (Math.random() < 0.1) {
            const glitch = new TextScramble(this);
            const currentValue = this.value;
            glitch.setText(currentValue + '_ glitch').then(() => {
                glitch.setText(currentValue);
            });
        }
    });
});

// Audio visual feedback (visual pulse)
function createPulse(x, y) {
    const pulse = document.createElement('div');
    pulse.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        border: 2px solid #ff006e;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        animation: pulse-expand 0.6s ease-out forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-expand {
            to {
                width: 50px;
                height: 50px;
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-pulse]')) {
        style.setAttribute('data-pulse', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(pulse);
    setTimeout(() => pulse.remove(), 600);
}

document.addEventListener('click', (e) => {
    if (Math.random() < 0.3) {
        createPulse(e.clientX, e.clientY);
    }
});

// Random background noise
function createNoise() {
    const noise = document.createElement('div');
    noise.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgbnVtT2N0YXZlcz0iMTAiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4wNSAwIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+');
        opacity: 0.02;
        pointer-events: none;
        z-index: 1;
    `;
    
    document.body.appendChild(noise);
    setTimeout(() => noise.remove(), 100);
}

setInterval(createNoise, 3000);

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Add staggered animations
    const chars = document.querySelectorAll('.scramble-char');
    chars.forEach((char, index) => {
        char.style.animationDelay = `${index * 0.1}s`;
    });
    
    const vChars = document.querySelectorAll('.v-char');
    vChars.forEach((char, index) => {
        char.style.setProperty('--i', index);
    });
    
    const cDots = document.querySelectorAll('.c-dot');
    cDots.forEach((dot, index) => {
        dot.style.setProperty('--i', index);
    });
});