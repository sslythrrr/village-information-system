document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap !== 'undefined') {
        window.addEventListener('load', () => {
            gsap.from('.intro-heading span', {
                duration: 2.2,
                y: 100,
                opacity: 0,
                ease: 'power4.out',
                stagger: 0.1
            });
            
            gsap.from('.intro-lead-in span', {
                duration: 2.2,
                y: 50,
                opacity: 0,
                ease: 'power4.out',
                delay: 0.8
            });
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section) {
        const element = document.getElementById(section);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});
