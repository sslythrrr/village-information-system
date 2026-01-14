document.addEventListener('DOMContentLoaded', function() {
    const announcements = document.querySelectorAll('.announcement-card');

    announcements.forEach((announcement, index) => {
        announcement.style.animationDelay = `${index * 0.1}s`;
        
        announcement.addEventListener('click', function() {
            const expanded = this.classList.contains('expanded');
            
            announcements.forEach(a => a.classList.remove('expanded'));
            
            if (!expanded) {
                this.classList.add('expanded');
            }
        });
    });

    const expandBtns = document.querySelectorAll('.expand-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.announcement-card');
            card.classList.toggle('expanded');
        });
    });
});
