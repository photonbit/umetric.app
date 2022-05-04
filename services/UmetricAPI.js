import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UmetricAPI = axios.create({
  baseURL: 'https://umetric.es',
  timeout: 10000
})

export async function login (username, password) {
  try {
    const response = await UmetricAPI.post('/api/auth',
      { username: username, password: password }
    )

    const cookies = response.headers['set-cookie']
    let remember_cookie

    if (cookies) {
      cookies.forEach(function (cookie) {
        if (cookie.startsWith('remember_token')) {
          remember_cookie = cookie
        }
      })

      if (remember_cookie) {
        await AsyncStorage.setItem('remember_cookie', remember_cookie)
      }
    }
    return response
  } catch (e) {
    console.log('login: ' + e.message)
  }
}

export async function getCategories () {
  try {
    const { data } = await UmetricAPI.get('/api/categories')

    return data
  } catch (e) {
    console.log('getCategories: ' + e.message)
    return []
  }
}

export async function addCategory (category) {
  try {
    return await UmetricAPI.post('/api/categories', category)
  } catch (e) {
    console.log('addCateory(' + category + '): ' + e.message)
    return null
  }
}

export async function editCategory({categoryId, modifiedCategory}) {
    try {
        return await UmetricAPI.put("/api/categories/" + categoryId, modifiedCategory)
    } catch (e) {
        console.log("editCateory(" + categoryId + "): " + e.message)
        return null
    }
}

export async function getIcons () {
  try {
    const { data } = await UmetricAPI.get('/api/icons')

    return data
  } catch (e) {
    console.log('getIcons(): ' + e.message)
    return []
  }
}

export async function getIcon ({ queryKey }) {
  const icon = queryKey[1]
  try {
    if (icon === undefined) {
      return null
    }
    const { data } = await UmetricAPI.get('/static/' + icon)

    return data
  } catch (e) {
    console.log('getIcon(' + icon + '): ' + e.message)
    return null
  }
}

export async function addEvent ({ categoryId, newEvent }) {
  try {
    return await UmetricAPI.post('/api/categories/' + categoryId + '/events', newEvent)
  } catch (e) {
    console.log('addEvent(' + categoryId + '): ' + e.message)
    console.log(newEvent)
    return null
  }
}

export async function getEvent ({ queryKey }) {
  const event_id = queryKey[1]
  try {
    const { data } = await UmetricAPI.get('/api/events/' + event_id)
    return data
  } catch (e) {
    console.log('getEvent(' + event_id + '): ' + e.message)
    return null
  }
}

export async function editEvent({eventId, modifiedEvent}) {
    try {
        return await UmetricAPI.put("/api/events/" + eventId, modifiedEvent)
    } catch (e) {
        console.log("editEvent(" + eventId + "): " + e.message)
        return null
    }
}

export async function getCategory({queryKey}) {
    const category_id = queryKey[1]
    try {
        const {data} = await UmetricAPI.get("/api/categories/" + category_id)
        return data
    } catch (e) {
        console.log("getCategory(" + category_id + "): " + e.message)
        return null
    }
}

export async function getEvents ({ queryKey }) {
  const category_id = queryKey[1]
  try {
    const { data } = await UmetricAPI.get('/api/categories/' + category_id + '/events')
    return data
  } catch (e) {
    console.log('getEvents(' + category_id + '): ' + e.message)
    return []
  }
}

export default UmetricAPI;