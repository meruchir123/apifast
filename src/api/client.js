// API client abstraction
// When the FastAPI backend is ready, replace mock implementations
// with actual fetch calls using this client.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
async function request(endpoint, options = {}) {
    const { params, ...fetchOptions } = options;
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.set(key, String(value));
            }
        });
        const qs = searchParams.toString();
        if (qs)
            url = `${url}?${qs}`;
    }
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(fetchOptions.headers ?? {}),
        },
        ...fetchOptions,
    });
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}
export const apiClient = {
    get: (endpoint, params) => request(endpoint, { method: 'GET', params }),
    post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
// Simulates a network delay for mock data
export function simulateDelay(data, ms = 400) {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
