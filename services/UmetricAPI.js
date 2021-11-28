import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


let UmetricAPI = axios.create({
    baseURL: 'https://umetric.es',
    timeout: 10000,
});

export async function login(username, password) {
    const response = await UmetricAPI.post("/api/auth",
        {"username": username, "password": password}
    )

    let cookies = response.headers["set-cookie"]
    let remember_cookie

    if (cookies) {
        cookies.forEach(function(cookie) {
            if (cookie.startsWith("remember_token")) {
                remember_cookie = cookie
            }
        })

        if (remember_cookie) {
            await AsyncStorage.setItem('remember_cookie', remember_cookie)
        }
    }
    return response
}

export async function getCategories() {
    const { data } = await UmetricAPI.get("/api/categories")

    return data
}

export async function addCategory(category) {
    return await UmetricAPI.post("/api/categories", category)
}

export async function editCategory({categoryId, categoryChanges}) {
    return await UmetricAPI.put("/api/categories/" + categoryId, categoryChanges)
}

export async function getIcons() {
    const { data } = await UmetricAPI.get("/api/icons")

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