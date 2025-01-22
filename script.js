document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioItems();
});

async function loadPortfolioItems() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    
    try {
        const response = await fetch('/ads/ads-config.json');
        const data = await response.json();
        
        // Group ads by client
        const groupedAds = data.ads.reduce((groups, ad) => {
            const client = ad.client;
            if (!groups[client]) {
                groups[client] = [];
            }
            groups[client].push(ad);
            return groups;
        }, {});

        // Sort ads within each group by dimensions
        Object.values(groupedAds).forEach(clientAds => {
            clientAds.sort((a, b) => {
                const [aWidth] = a.dimensions.split('x').map(Number);
                const [bWidth] = b.dimensions.split('x').map(Number);
                return bWidth - aWidth; // Sort by width, largest first
            });
        });

        // Clear existing content
        portfolioGrid.innerHTML = '';

        // Create campaign sections for each client
        Object.entries(groupedAds).forEach(([client, ads]) => {
            // Add campaign header
            const campaignHeader = document.createElement('div');
            campaignHeader.className = 'campaign-header';
            campaignHeader.innerHTML = `<h3>${client} Campaign</h3>`;
            portfolioGrid.appendChild(campaignHeader);

            // Create campaign container
            const campaignContainer = document.createElement('div');
            campaignContainer.className = 'campaign-container';

            // Add ads for this client
            ads.forEach(ad => {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = `portfolio-item size-${ad.dimensions.replace('x', 'x')}`;

                let element;
                if (ad.type === 'video') {
                    element = document.createElement('video');
                    element.controls = true;
                    element.muted = true;
                    element.loop = true;
                    element.preload = 'metadata';
                    
                    // Add poster if available
                    if (ad.poster) {
                        element.poster = `/ads/${ad.poster}`;
                    }

                    // Create loading overlay
                    const loadingOverlay = document.createElement('div');
                    loadingOverlay.className = 'video-loading-overlay';
                    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
                    portfolioItem.appendChild(loadingOverlay);

                    // Handle video loading states
                    element.addEventListener('loadeddata', () => {
                        loadingOverlay.style.display = 'none';
                    });
                    
                    // Play/pause on hover for videos
                    portfolioItem.addEventListener('mouseenter', () => {
                        element.play().catch(err => console.log('Playback prevented:', err));
                    });
                    portfolioItem.addEventListener('mouseleave', () => {
                        element.pause();
                        element.currentTime = 0;
                    });
                } else {
                    element = document.createElement('img');
                }
                
                element.src = `/ads/${ad.file}`;
                element.alt = `${ad.client} - ${ad.dimensions} Banner Ad`;
                element.width = ad.dimensions.split('x')[0];
                element.height = ad.dimensions.split('x')[1];

                // Add metadata
                const metadata = document.createElement('div');
                metadata.className = 'portfolio-item-metadata';
                metadata.innerHTML = `
                    <p class="dimensions">${ad.dimensions}</p>
                    <p class="format">${ad.type.toUpperCase()}</p>
                `;

                portfolioItem.appendChild(element);
                portfolioItem.appendChild(metadata);
                campaignContainer.appendChild(portfolioItem);
            });

            portfolioGrid.appendChild(campaignContainer);
        });
    } catch (error) {
        console.error('Error loading portfolio items:', error);
        portfolioGrid.innerHTML = '<p>Error loading portfolio items. Please try again later.</p>';
    }
} 