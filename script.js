document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioItems();
});

async function loadPortfolioItems() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    try {
        const response = await fetch('/ads/');
        const files = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(files, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
            .filter(a => a.href.match(/\.(gif|mp4)$/i));

        links.forEach(link => {
            const fileName = link.href.split('/').pop();
            const fileExtension = fileName.split('.').pop().toLowerCase();
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';

            if (fileExtension === 'mp4') {
                const video = document.createElement('video');
                video.src = `/ads/${fileName}`;
                video.controls = true;
                video.autoplay = false;
                video.muted = true;
                video.loop = true;
                portfolioItem.appendChild(video);

                // Play video on hover
                portfolioItem.addEventListener('mouseenter', () => video.play());
                portfolioItem.addEventListener('mouseleave', () => video.pause());
            } else {
                const img = document.createElement('img');
                img.src = `/ads/${fileName}`;
                img.alt = `Banner ad - ${fileName}`;
                portfolioItem.appendChild(img);
            }

            portfolioGrid.appendChild(portfolioItem);
        });
    } catch (error) {
        console.error('Error loading portfolio items:', error);
        portfolioGrid.innerHTML = '<p>Error loading portfolio items. Please try again later.</p>';
    }
} 