const commonAxiosConfig = {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

const BASE_ENDPOINT = "http://localhost:3001"
const ROUTES = {
    greeting: 'greeting',
    reply: 'reply'
}

export { commonAxiosConfig, BASE_ENDPOINT, ROUTES }