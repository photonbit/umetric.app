import axios from 'axios';

let UmetricAPI = axios.create({
  baseURL: 'https://umetric.es',
  timeout: 10000,
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = token => {
  UmetricAPI.interceptors.request.use(function(config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export function login(username, password, onSuccess, onFailure) {
    UmetricAPI.post("/api/auth",
        { "username": username, "password": password}
    )
    .then(onSuccess)
    .catch(onFailure)
}

export function get_categories(onSuccess, onFailure) {
    UmetricAPI.get("/api/categories")
        .then(onSuccess)
        .catch(onFailure)
}

export function get_events(category, onSuccess, onFailure) {
    UmetricAPI.get("/api/categories/" + category)
        .then(onSuccess)
        .catch(onFailure)
}

export default UmetricAPI;