import axios from 'axios';

let UmetricAPI = axios.create({
    baseURL: 'https://umetric.es',
    timeout: 10000,
});


export function login(username, password, onSuccess, onFailure) {
    UmetricAPI.post("/api/auth",
        {"username": username, "password": password}
    )
        .then(onSuccess)
        .catch(onFailure)
}

export function get_categories(onSuccess, onFailure) {
    UmetricAPI.get("/api/categories")
        .then(onSuccess)
        .catch(onFailure)
}

export function get_icon(icon, onSuccess, onFailure) {
    UmetricAPI.get("/static/" + icon)
        .then(onSuccess)
        .catch(onFailure)
}

export function get_events(category, onSuccess, onFailure) {
    UmetricAPI.get("/api/categories/" + category)
        .then(onSuccess)
        .catch(onFailure)
}

export default UmetricAPI;