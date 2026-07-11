const PHP_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001';

async function fetchJSON(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
}

export async function getOverview() {
    return fetchJSON(`${PHP_BASE}/api/intelligence.php?action=overview`);
}

export async function getProductIntelligence(id, months = 3) {
    return fetchJSON(`${PHP_BASE}/api/intelligence.php?action=product&id=${id}&months=${months}`);
}

export async function getPriceReview(threshold = 3) {
    return fetchJSON(`${PHP_BASE}/api/intelligence.php?action=review&threshold=${threshold}`);
}

export async function getQuoteRisk(id, months) {
    return fetchJSON(`${PHP_BASE}/api/intelligence.php?action=risk&id=${id}&months=${months}`);
}

export async function getProducts() {
    return fetchJSON(`${PHP_BASE}/api/products.php`);
}

export async function updatePrice(id, newPrice) {
    return fetchJSON(`${PHP_BASE}/api/prices.php?id=${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ newPrice }),
    });
}

export async function triggerPriceFetch() {
    return fetchJSON(`${PHP_BASE}/api/analytics.php?action=fetch`, {
        method: 'POST',
    });
}

export async function getPriceHistory(id) {
    return fetchJSON(`${PHP_BASE}/api/prices.php?id=${id}`);
}

export async function getAnomalies() {
    return fetchJSON(`${PHP_BASE}/api/analytics.php?type=anomalies`);
}