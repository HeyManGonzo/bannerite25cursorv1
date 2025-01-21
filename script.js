document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioItems();
});

async function loadPortfolioItems() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    try {
        const response = await fetch('/ads/ads-config.json');
        const data = await response.json();
        
        data.ads.forEach(ad => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';

            const isGif = ad.type === 'gif';
            const element = document.createElement(isGif ? 'img' : 'img');
            
            if (isGif) {
                element.src = `/ads/${ad.file}`;
                element.alt = `${ad.client} - ${ad.dimensions} Banner Ad`;
            } else {
                element.src = `/ads/${ad.file}`;
                element.alt = `${ad.client} - ${ad.dimensions} Banner Ad`;
            }

            // Add metadata
            const metadata = document.createElement('div');
            metadata.className = 'portfolio-item-metadata';
            metadata.innerHTML = `
                <h3>${ad.client}</h3>
                <p>${ad.dimensions}</p>
            `;

            portfolioItem.appendChild(element);
            portfolioItem.appendChild(metadata);
            portfolioGrid.appendChild(portfolioItem);
        });
    } catch (error) {
        console.error('Error loading portfolio items:', error);
        portfolioGrid.innerHTML = '<p>Error loading portfolio items. Please try again later.</p>';
    }
} 