import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import i18n from 'i18n-js'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Q } from '@nozbe/watermelondb'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { Feather } from '@expo/vector-icons'
import { importQuestionnaireFromUrl } from '../utils/importQuestionnaire'
import { getCurrentUser, migrateUserId } from '../utils/userUtils'
import { DEFAULT_POMODORO_DURATION_MINUTES, POMODORO_DURATION_KEY } from '../constants/pomodoro'
import { 
  performManualSync, 
  startAutomaticSync, 
  stopAutomaticSync, 
  isSyncInProgress,
  getSyncConfiguration,
  validateSyncConfiguration 
} from '../utils/syncService'
import { SYNC_FREQUENCY } from '../constants/sync'

function ConfigurationScreen({}) {
  const database = useDatabase()
  const [user, setUser] = useState(null)

  // Synchronization
  const [serverUrl, setServerUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [encryptionKey, setEncryptionKey] = useState('')
  const [syncFrequency, setSyncFrequency] = useState(SYNC_FREQUENCY.NEVER)

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

  // Sync status
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState(null)
  const [syncError, setSyncError] = useState(null)
  const [autoSyncActive, setAutoSyncActive] = useState(false)
  const [syncConfig, setSyncConfig] = useState(null)

  // Connection check state
  const [checkInProgress, setCheckInProgress] = useState(false)
  const [checkDone, setCheckDone] = useState(false)

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

    const loadSyncConfig = async () => {
      const config = await getSyncConfiguration(database)
      setSyncConfig(config)
    }
    
    loadUser()
    loadPomodoroDuration()
    loadSyncConfig()
  }, [database])

  useEffect(() => {
    if (!user) return

    setServerUrl(user.serverUrl || '')
    setUsername(user.username || '')
    setPassword(user.password || '')
    setEncryptionKey(user.encryptionKey || '')
    setSyncFrequency(user.syncFrequency || SYNC_FREQUENCY.NEVER)
    setFirstName(user.firstName || '')
    setLastName(user.lastName || '')
    setEmail(user.email || '')
    setSundayWeekStart(!!user.sundayWeekStart)

    setBaseline({
      serverUrl: user.serverUrl || '',
      username: user.username || '',
      password: user.password || '',
      encryptionKey: user.encryptionKey || '',
      syncFrequency: user.syncFrequency || SYNC_FREQUENCY.NEVER,
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

  // Reset check flag when server configuration changes again
  useEffect(() => {
    if (!baseline) return
    const changed = !(
      stringsEqual(serverUrl, baseline.serverUrl) &&
      stringsEqual(username, baseline.username) &&
      stringsEqual(password, baseline.password) &&
      stringsEqual(encryptionKey, baseline.encryptionKey)
    )
    if (changed) {
      setCheckDone(false)
    }
  }, [serverUrl, username, password, encryptionKey, baseline])

  useEffect(() => {
    expand.value = syncFrequency !== SYNC_FREQUENCY.NEVER ? 1 : 0
  }, [syncFrequency, expand])

  // Start automatic sync if enabled
  useEffect(() => {
    const initializeSync = async () => {
      if (user && user.syncFrequency === SYNC_FREQUENCY.AUTO) {
        try {
          await startAutomaticSync(database)
          setAutoSyncActive(true)
        } catch (error) {
          console.error('Failed to start automatic sync:', error)
          setAutoSyncActive(false)
        }
      } else {
        setAutoSyncActive(false)
      }
    }

    initializeSync()

    // Cleanup on unmount
    return () => {
      stopAutomaticSync()
      setAutoSyncActive(false)
    }
  }, [user, database])

  // Periodically check sync status for auto sync
  useEffect(() => {
    if (autoSyncActive) {
      const interval = setInterval(() => {
        // This is a simple way to show that auto sync is working
        console.log('Auto sync is active and running...')
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoSyncActive])

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

  // Check connection availability: enabled when server config fields change
  const serverConfigChanged = baseline ? !(
    stringsEqual(serverUrl, baseline.serverUrl) &&
    stringsEqual(username, baseline.username) &&
    stringsEqual(password, baseline.password) &&
    stringsEqual(encryptionKey, baseline.encryptionKey)
  ) : false

  const showCheckConnection = serverConfigChanged && !checkDone

  const saveAll = async () => {
    if (!user || !hasChanges) return
    
    // Validate sync configuration if sync is enabled
    if (syncFrequency !== SYNC_FREQUENCY.NEVER) {
      const validation = validateSyncConfiguration({
        serverUrl,
        username,
        password,
        syncFrequency
      })
      
      if (!validation.isValid) {
        Toast.show({ 
          type: 'error', 
          text1: i18n.t('sync_configuration_error'), 
          text2: validation.errors.join(', ') 
        })
        return
      }
    }
    
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

    // Handle sync configuration changes
    if (syncFrequency === SYNC_FREQUENCY.NEVER) {
      stopAutomaticSync()
      setAutoSyncActive(false)
    } else if (syncFrequency === SYNC_FREQUENCY.AUTO) {
      // Restart automatic sync with new configuration
      stopAutomaticSync()
      try {
        await startAutomaticSync(database)
        setAutoSyncActive(true)
      } catch (error) {
        console.error('Failed to start automatic sync:', error)
        setAutoSyncActive(false)
      }
    } else {
      setAutoSyncActive(false)
    }
    // For SYNC_FREQUENCY.MANUAL, we don't need to do anything special

    // Refresh sync configuration
    const config = await getSyncConfiguration(database)
    setSyncConfig(config)

    Toast.show({ type: 'success', text1: i18n.t('settings_saved') })
  }

  const onChangeFrequency = (opt) => {
    setSyncFrequency(opt)
  }

  const onCheckConnection = async () => {
    if (checkInProgress) return

    setCheckInProgress(true)
    try {
      const trimmedUrl = (serverUrl || '').trim()
      if (!trimmedUrl) {
        throw new Error('Server URL is required')
      }
      // Validate URL
      let base
      try {
        base = new URL(trimmedUrl)
      } catch (e) {
        throw new Error('Server URL must be a valid URL')
      }
      const baseStr = base.toString()
      const baseWithSlash = baseStr.endsWith('/') ? baseStr : `${baseStr}/`
      const endpoint = `${baseWithSlash}api/user_id`

      if (!username || !password) {
        throw new Error('Username and password are required')
      }

      const auth = btoa(`${username}:${password}`)
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Connection failed: ${response.status} ${response.statusText} - ${text}`)
      }

      const data = await response.json()
      const serverId = data && data.id
      if (!serverId) {
        throw new Error('Invalid response from server: missing id')
      }

      if (!user) {
        throw new Error('No local user found')
      }

      if (serverId === user.id) {
        setCheckDone(true)
        Toast.show({ type: 'success', text1: i18n.t('connection_ok') || 'Connection OK', text2: 'User ID matches' })
        return
      }

      // Migrate local data to new user id
      await migrateUserId(database, user.id, serverId)
      const updatedUser = await getCurrentUser(database)
      setUser(updatedUser)
      setCheckDone(true)
      Toast.show({ type: 'success', text1: i18n.t('user_migrated') || 'User migrated', text2: 'Updated local data to server user ID' })
    } catch (e) {
      Toast.show({ type: 'error', text1: i18n.t('check_connection_failed') || 'Check connection failed', text2: String(e.message || e) })
    } finally {
      setCheckInProgress(false)
    }
  }

  const onSyncNow = async () => {
    if (isSyncing || isSyncInProgress()) {
      Toast.show({ type: 'info', text1: i18n.t('sync_in_progress') })
      return
    }

    setIsSyncing(true)
    setSyncError(null)

    try {
      const result = await performManualSync(database)
      setLastSyncTime(new Date())
      setSyncError(null)
      
      // Refresh sync configuration
      const config = await getSyncConfiguration(database)
      setSyncConfig(config)
      
      Toast.show({ 
        type: 'success', 
        text1: i18n.t('sync_successful'), 
        text2: `${result.changesPushed} changes pushed` 
      })
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncError(error.message)
      Toast.show({ 
        type: 'error', 
        text1: i18n.t('sync_failed'), 
        text2: error.message 
      })
    } finally {
      setIsSyncing(false)
    }
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
          {[SYNC_FREQUENCY.MANUAL, SYNC_FREQUENCY.AUTO, SYNC_FREQUENCY.NEVER].map((opt) => (
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

            {showCheckConnection && (
              <TouchableOpacity 
                style={[
                  styles.buttonSecondary, 
                  (checkInProgress) && styles.buttonDisabled
                ]}
                onPress={onCheckConnection}
                disabled={checkInProgress}
              >
                <Text style={styles.buttonText}>
                  {checkInProgress ? (i18n.t('checking_connection') || 'Checking...') : (i18n.t('check_connection') || 'Check connection')}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[
                styles.buttonSecondary, 
                (isSyncing || isSyncInProgress()) && styles.buttonDisabled
              ]} 
              onPress={onSyncNow}
              disabled={isSyncing || isSyncInProgress()}
            >
              <Text style={styles.buttonText}>
                {isSyncing || isSyncInProgress() ? i18n.t('syncing') : i18n.t('sync_now')}
              </Text>
            </TouchableOpacity>

            {/* Sync Status */}
            {lastSyncTime && (
              <Text style={styles.syncStatus}>
                {i18n.t('last_sync')}: {lastSyncTime.toLocaleString()}
              </Text>
            )}
            
            {syncError && (
              <Text style={styles.syncError}>
                {i18n.t('sync_error')}: {syncError}
              </Text>
            )}
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
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    borderColor: '#cccccc'
  },
  syncStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center'
  },
  syncError: {
    fontSize: 14,
    color: '#ff4444',
    marginTop: 8,
    textAlign: 'center'
  },
  autoSyncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10
  },
  autoSyncText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500'
  },
  syncConfigStatus: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },
  syncConfigRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  syncConfigText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  syncConfigDetails: {
    marginLeft: 24,
    gap: 4
  },
  syncConfigDetailText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  }
}) 