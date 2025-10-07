import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import i18n from 'i18n-js'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Q } from '@nozbe/watermelondb'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { Feather } from '@expo/vector-icons'
import { importQuestionnaireFromUrl } from '../utils/importQuestionnaire'
import { getCurrentUser } from '../utils/userUtils'
import { DEFAULT_POMODORO_DURATION_MINUTES, POMODORO_DURATION_KEY } from '../constants/pomodoro'

function ConfigurationScreen({}) {
  const database = useDatabase()
  const [user, setUser] = useState(null)

  // Synchronization
  const [serverUrl, setServerUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [encryptionKey, setEncryptionKey] = useState('')
  const [syncFrequency, setSyncFrequency] = useState('Never')

  // User Information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [sundayWeekStart, setSundayWeekStart] = useState(false)

  // Pomodoro (stored in localStorage, not in User model)
  const [pomodoroDuration, setPomodoroDuration] = useState(String(DEFAULT_POMODORO_DURATION_MINUTES))
  const [baselinePomodoroDuration, setBaselinePomodoroDuration] = useState(DEFAULT_POMODORO_DURATION_MINUTES)

  // Questionnaires
  const [questionnaireUrl, setQuestionnaireUrl] = useState('https://umetric.app/id/pvq')
  const [questionnaires, setQuestionnaires] = useState([])

  // Baseline values from DB for change detection
  const [baseline, setBaseline] = useState(null)

  const expand = useSharedValue(0)
  const collapseStyle = useAnimatedStyle(() => {
    const maxHeight = withTiming(expand.value ? 1000 : 0, { duration: 220 })
    const opacity = withTiming(expand.value ? 1 : 0, { duration: 180 })
    return { maxHeight, opacity }
  })

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser(database)
      setUser(currentUser)
    }
    
    const loadPomodoroDuration = async () => {
      const duration = await database.localStorage.get(POMODORO_DURATION_KEY)
      const parsedDuration = duration ? parseInt(duration) : DEFAULT_POMODORO_DURATION_MINUTES
      setPomodoroDuration(String(parsedDuration))
      setBaselinePomodoroDuration(parsedDuration)
    }
    
    loadUser()
    loadPomodoroDuration()
  }, [database])

  useEffect(() => {
    if (!user) return

    setServerUrl(user.serverUrl || '')
    setUsername(user.username || '')
    setPassword(user.password || '')
    setEncryptionKey(user.encryptionKey || '')
    setSyncFrequency(user.syncFrequency || 'Never')
    setFirstName(user.firstName || '')
    setLastName(user.lastName || '')
    setEmail(user.email || '')
    setSundayWeekStart(!!user.sundayWeekStart)

    setBaseline({
      serverUrl: user.serverUrl || '',
      username: user.username || '',
      password: user.password || '',
      encryptionKey: user.encryptionKey || '',
      syncFrequency: user.syncFrequency || 'Never',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      sundayWeekStart: !!user.sundayWeekStart,
    })
  }, [user])

  useEffect(() => {
    const loadQuestionnaires = async () => {
      const questionnairesCollection = database.get('questionnaires')
      const allQuestionnaires = await questionnairesCollection.query().fetch()
      setQuestionnaires(allQuestionnaires)
    }

    loadQuestionnaires()
  }, [database])

  useEffect(() => {
    expand.value = syncFrequency !== 'Never' ? 1 : 0
  }, [syncFrequency, expand])

  const valuesEqual = (a, b) => a === b
  const stringsEqual = (a, b) => (a || '').trim() === (b || '').trim()

  const hasChanges = baseline ? !(
    stringsEqual(serverUrl, baseline.serverUrl) &&
    stringsEqual(username, baseline.username) &&
    stringsEqual(password, baseline.password) &&
    stringsEqual(encryptionKey, baseline.encryptionKey) &&
    valuesEqual(syncFrequency, baseline.syncFrequency) &&
    stringsEqual(firstName, baseline.firstName) &&
    stringsEqual(lastName, baseline.lastName) &&
    stringsEqual(email, baseline.email) &&
    valuesEqual(!!sundayWeekStart, !!baseline.sundayWeekStart) &&
    valuesEqual(parseInt(pomodoroDuration) || DEFAULT_POMODORO_DURATION_MINUTES, baselinePomodoroDuration)
  ) : false

  const saveAll = async () => {
    if (!user || !hasChanges) return
    
    await database.write(async () => {
      await user.update((u) => {
        u.serverUrl = serverUrl
        u.username = username
        u.password = password
        u.encryptionKey = encryptionKey
        u.syncFrequency = syncFrequency
        u.firstName = firstName
        u.lastName = lastName
        u.email = email
        u.sundayWeekStart = sundayWeekStart
      })
    })

    // Save pomodoro duration to localStorage
    const duration = parseInt(pomodoroDuration) || DEFAULT_POMODORO_DURATION_MINUTES
    await database.localStorage.set(POMODORO_DURATION_KEY, String(duration))
    setBaselinePomodoroDuration(duration)

    setBaseline({
      serverUrl,
      username,
      password,
      encryptionKey,
      syncFrequency,
      firstName,
      lastName,
      email,
      sundayWeekStart: !!sundayWeekStart,
    })
  }

  const onChangeFrequency = (opt) => {
    setSyncFrequency(opt)
  }

  const onImportQuestionnaire = async () => {
    const url = (questionnaireUrl || '').trim()
    if (!url) {
      Toast.show({ type: 'error', text1: i18n.t('somethingIsWrong'), text2: 'URL is empty' })
      return
    }
    try {
      const created = await importQuestionnaireFromUrl(database, url)
      Toast.show({ type: 'success', text1: i18n.t('questionnaire'), text2: created.name })
      // Refresh questionnaires list
      const questionnairesCollection = database.get('questionnaires')
      const allQuestionnaires = await questionnairesCollection.query().fetch()
      setQuestionnaires(allQuestionnaires)
      setQuestionnaireUrl('')
    } catch (e) {
      Toast.show({ type: 'error', text1: i18n.t('somethingIsWrong'), text2: String(e.message || e) })
    }
  }

  const onDeleteQuestionnaire = async (questionnaire) => {
    try {
      await database.write(async () => {
        console.log('Deleting questionnaire:', questionnaire.id, questionnaire.name)
        
        // Delete all responses first (they reference questionnaire responses)
        const responses = await database.collections.get('responses')
          .query(Q.where('questionnaire_response_id', questionnaire.id))
          .fetch()
        console.log('Deleting responses:', responses.length)
        for (const response of responses) {
          await response.destroyPermanently()
        }

        // Delete all questionnaire responses
        const questionnaireResponses = await database.collections.get('questionnaire_responses')
          .query(Q.where('questionnaire_id', questionnaire.id))
          .fetch()
        console.log('Deleting questionnaire responses:', questionnaireResponses.length)
        for (const response of questionnaireResponses) {
          await response.destroyPermanently()
        }

        // Delete all question-likert scale links for questions in this questionnaire
        const questions = await database.collections.get('questions')
          .query(Q.where('questionnaire_id', questionnaire.id))
          .fetch()
        
        for (const question of questions) {
          const questionLikertLinks = await database.collections.get('question_likert')
            .query(Q.where('question_id', question.id))
            .fetch()
          console.log('Deleting question-likert links for question', question.id, ':', questionLikertLinks.length)
          for (const link of questionLikertLinks) {
            await link.destroyPermanently()
          }
        }

        // Delete all questions
        console.log('Deleting questions:', questions.length)
        for (const question of questions) {
          await question.destroyPermanently()
        }

        // Delete all likert scales for this questionnaire
        const likertScales = await database.collections.get('likert_scales')
          .query(Q.where('questionnaire_id', questionnaire.id))
          .fetch()
        console.log('Deleting likert scales:', likertScales.length)
        for (const likertScale of likertScales) {
          await likertScale.destroyPermanently()
        }

        // Delete all translations
        const questionnaireTranslations = await database.collections.get('questionnaire_translations')
          .query(Q.where('questionnaire_id', questionnaire.id))
          .fetch()
        console.log('Deleting questionnaire translations:', questionnaireTranslations.length)
        for (const translation of questionnaireTranslations) {
          await translation.destroyPermanently()
        }

        // Delete question translations for questions in this questionnaire
        for (const question of questions) {
          const questionTranslations = await database.collections.get('question_translations')
            .query(Q.where('question_id', question.id))
            .fetch()
          console.log('Deleting question translations for question', question.id, ':', questionTranslations.length)
          for (const translation of questionTranslations) {
            await translation.destroyPermanently()
          }
        }

        // Delete likert scale translations for likert scales in this questionnaire
        for (const likertScale of likertScales) {
          const likertScaleTranslations = await database.collections.get('likert_scale_translations')
            .query(Q.where('likert_scale_id', likertScale.id))
            .fetch()
          console.log('Deleting likert scale translations for likert scale', likertScale.id, ':', likertScaleTranslations.length)
          for (const translation of likertScaleTranslations) {
            await translation.destroyPermanently()
          }
        }

        // Finally, delete the questionnaire itself
        console.log('Deleting questionnaire itself')
        await questionnaire.destroyPermanently()
      })
      
      // Refresh questionnaires list
      const questionnairesCollection = database.get('questionnaires')
      const allQuestionnaires = await questionnairesCollection.query().fetch()
      setQuestionnaires(allQuestionnaires)
      Toast.show({ type: 'success', text1: i18n.t('questionnaire'), text2: `${questionnaire.name} deleted` })
    } catch (e) {
      console.error('Error deleting questionnaire:', e)
      Toast.show({ type: 'error', text1: i18n.t('somethingIsWrong'), text2: String(e.message || e) })
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>{i18n.t('synchronization')}</Text>

        <Text style={styles.label}>{i18n.t('frequency')}</Text>
        <View style={styles.segmented}>
          {['Manual', 'Auto', 'Never'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={{ ...styles.segment, ...(syncFrequency === opt ? styles.segmentActive : {}) }}
              onPress={() => onChangeFrequency(opt)}
            >
              <Text style={{ ...styles.segmentText, ...(syncFrequency === opt ? styles.segmentTextActive : {}) }}>{i18n.t(opt.toLowerCase())}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Animated.View style={[styles.collapseContainer, collapseStyle]}>
          <View>
            <Text style={styles.label}>{i18n.t('server_url')} *</Text>
            <TextInput style={styles.input} value={serverUrl} onChangeText={setServerUrl} placeholder={i18n.t('server_url_placeholder')} />

            <Text style={styles.label}>{i18n.t('username')} *</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} />

            <Text style={styles.label}>{i18n.t('password')} *</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

            <Text style={styles.label}>{i18n.t('encryption_key')}</Text>
            <TextInput style={styles.input} value={encryptionKey} onChangeText={setEncryptionKey} />

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => { alert("Tus ganas") }}>
              <Text style={styles.buttonText}>{i18n.t('sync_now')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>{i18n.t('user_information')}</Text>
        <Text style={styles.label}>{i18n.t('name')}</Text>
        <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

        <Text style={styles.label}>{i18n.t('last_name')}</Text>
        <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

        <Text style={styles.label}>{i18n.t('email')}</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>{i18n.t('week_start_day')}</Text>
        <View style={styles.segmented}>
          {['Sunday', 'Monday'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={{ ...styles.segment, ...((sundayWeekStart ? 'Sunday' : 'Monday') === opt ? styles.segmentActive : {}) }}
              onPress={() => setSundayWeekStart(opt === 'Sunday')}
            >
              <Text style={{ ...styles.segmentText, ...((sundayWeekStart ? 'Sunday' : 'Monday') === opt ? styles.segmentTextActive : {}) }}>{i18n.t(opt.toLowerCase())}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{i18n.t('pomodoro')}</Text>
        <Text style={styles.label}>{i18n.t('pomodoro_duration')}</Text>
        <TextInput 
          style={styles.input} 
          value={pomodoroDuration} 
          onChangeText={setPomodoroDuration} 
          keyboardType="numeric"
          placeholder={String(DEFAULT_POMODORO_DURATION_MINUTES)}
        />

        <Text style={styles.sectionTitle}>{i18n.t('questionnaires')}</Text>
        
        {questionnaires.length > 0 && (
          <View style={styles.questionnaireList}>
            <Text style={styles.label}>{i18n.t('existing_questionnaires')}</Text>
            {questionnaires.map((questionnaire) => (
              <View key={questionnaire.id} style={styles.questionnaireItem}>
                <Text style={styles.questionnaireName}>{questionnaire.name}</Text>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => onDeleteQuestionnaire(questionnaire)}
                >
                  <Feather name="trash-2" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.label}>{i18n.t('questionnaire_url')}</Text>
        <TextInput style={styles.input} value={questionnaireUrl} onChangeText={setQuestionnaireUrl} placeholder={i18n.t('questionnaire_url_placeholder')} />
        <TouchableOpacity style={styles.button} onPress={onImportQuestionnaire}>
          <Text style={styles.buttonText}>{i18n.t('import_questionnaire')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={{ ...styles.button, ...(hasChanges ? {} : { backgroundColor: '#cccccc', borderColor: '#cccccc' }) }}
          onPress={saveAll}
          disabled={!hasChanges}
        >
          <Text style={styles.buttonText}>{i18n.t('save')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ConfigurationScreen

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5
  },
  label: {
    fontSize: 16,
    marginTop: 10
  },
  input: {
    fontSize: 16,
    width: '100%',
    borderColor: '#CCCCCC',
    backgroundColor: '#FAFAFA',
    color: '#111111',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 5
  },
  segmented: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
    marginBottom: 10
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA'
  },
  segmentActive: {
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC'
  },
  segmentText: {
    textAlign: 'center',
    color: '#111111',
    fontSize: 16
  },
  segmentTextActive: {
    color: 'white'
  },
  collapseContainer: {
    overflow: 'hidden'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  buttonSecondary: {
    height: 36,
    backgroundColor: '#999999',
    borderColor: '#999999',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white'
  },
  questionnaireList: {
    marginBottom: 20
  },
  questionnaireItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8
  },
  questionnaireName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10
  },
  deleteButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4444'
  }
}) 