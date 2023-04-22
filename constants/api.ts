const BASE_ENDPOINT = "https://peer-native.herokuapp.com" || "http://localhost:3001"

const commonAxiosConfig = {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

const ROUTES = {
    greeting: 'greeting',
    reply: 'reply'
}

export { commonAxiosConfig, BASE_ENDPOINT, ROUTES }