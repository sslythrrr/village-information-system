document.addEventListener('DOMContentLoaded', function() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    const readMoreBtns = document.querySelectorAll('.btn-read-more');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});
