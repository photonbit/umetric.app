import axios from 'axios';

let UmetricAPI = axios.create({
    baseURL: 'https://umetric.es',
    timeout: 10000,
});


export async function login(username, password) {
    const response = await UmetricAPI.post("/api/auth",
        {"username": username, "password": password}
    )

    return response
}

export async function getCategories() {
    const { data } = await UmetricAPI.get("/api/categories")

    return data
}

export async function getIcon(icon) {
    const { data } = await UmetricAPI.get("/static/" + icon)

    return data
}

export async function getEvents({queryKey}) {
    const [_key, category_id] = queryKey
    const {data} = await UmetricAPI.get("/api/categories/" + category_id)
    return data
}

export default UmetricAPI;