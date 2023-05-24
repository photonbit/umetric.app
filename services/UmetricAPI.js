import { useContext } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-toast-message'

import { Context } from '../filters/Store'
import i18n from "i18n-js";

const UmetricAPI = () => {
  const { logout } = useContext(Context)

  const instance = axios.create({
    baseURL: 'https://umetric.es',
    timeout: 10000
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        Toast.show({
          type: 'error',
          text1: i18n.t('authError'),
          text2: error.message
        })
        logout();
      }

      return Promise.reject(error);
    })

    return {
        login: async (username, password) => {
          const response = await instance.post('/api/auth',
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
        },
        getCategories: async () => {
          const { data } = await instance.get('/api/categories')
          return data
        },
        addCategory: async (category) => {
            return await instance.post('/api/categories', category)
        },
           editCategory: async (categoryId, modifiedCategory) => {
            return await instance.put('/api/categories/' + categoryId, modifiedCategory)
        },
        deleteCategory: async (categoryId) => {
            return await instance.delete('/api/categories/' + categoryId)
        },
        updateCategories: async (categories) => {
          return await instance.patch('/api/categories', {'categories': categories})
        },
        getIcons: async () => {
          const { data } = await instance.get('/api/icons')
          return data
        },
        getIcon: async ({queryKey}) => {
          const icon = queryKey[1]
          if (icon === undefined) {
            return null
          }
          const { data } = await instance.get('/static/' + icon)

          return data
        },
        addEvent: async ({categoryId, newEvent}) => {
          return await instance.post('/api/categories/' + categoryId + '/events', newEvent)
        },
        getEvent: async ({queryKey}) => {
          const eventId = queryKey[1]
          const { data } = await instance.get('/api/events/' + eventId)
          return data
        },
        editEvent: async ({eventId, modifiedEvent}) => {
          return await instance.put('/api/events/' + eventId, modifiedEvent)
        },
        deleteEvent: async ({eventId}) => {
          return await instance.delete('/api/events/' + eventId)
        },
        updateEvents: async ({events}) => {
          return await instance.patch('/api/events', {'events': events})
        },
        logEvent: async ({eventId, duration}) => {
          const uri = '/api/events/' + eventId + '/logs'
          const body = {}
          if (duration) {
            body.duration = duration
          }
          return await instance.post(uri, body)
        },
        getCategory: async ({queryKey}) => {
          const categoryId = queryKey[1]
          const {data} = await instance.get('/api/categories/' + categoryId)
          return data
        },
        getEvents: async ({queryKey}) => {
          const category_id = queryKey[1]
          const {data} = await instance.get('/api/categories/' + category_id + '/events')
          return data
        },
        getGoals: async () => {
          const {data} = await instance.get('/api/goals')
          return data
        },
        getGoal: async ({queryKey}) => {
          const goalId = queryKey[1]
          const { data } = await instance.get('/api/goals/' + goal_id)
          return data
        },
        addGoal: async ({newGoal}) => {
          return await instance.post('/api/goals', newGoal)
        },
        editGoal: async ({goalId, modifiedGoal}) => {
          return await instance.put('/api/goals/' + goalId, modifiedGoal)
        },
        deleteGoal: async ({goalId}) => {
          return await instance.delete('/api/goals/' + goalId)
        },
        getCommitments: async ({queryKey}) => {
          const week = queryKey[1]
          let url = '/api/commitments'
          if (parseInt(week) > 0) {
            url += '/'+week
          }
          const { data } = await instance.get(url)
          return data
        },
        getQuestionnaires: async () => {
          const {data} = instance.get('/questionnaires')
          return data
        },
        getQuestionnaire: async (questionnaireId) => {
          const {data} = instance.get('/questionnaires/' + questionnaireId)
          return data
        },
        getQuestionnaireResponses: async () => {
          const {data} = instance.get('/questionnaires/fillings')
          return data
        },
        startQuestionnaire: async (questionnaireId) => {
          const {data} = await instance.post('/questionnaires/fillings', {questionnaire_id: questionnaireId})
          return data
        },
        submitResponse: async (questionnaireResponseId, questionId, value) => {
          const {data} = await instance.post(`/questionnaires/fillings/${questionnaireResponseId}/responses`, {
            questionnaire_response_id: questionnaireResponseId,
            question_id: questionId,
            value: value,
          });
          return data
        }
    }
}


export default UmetricAPI
