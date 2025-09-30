import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import i18n from 'i18n-js'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

function ConfigurationScreen({}) {
  const database = useDatabase()
  const [userId, setUserId] = useState(null)

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

  // Questionnaires
  const [questionnaireUrl, setQuestionnaireUrl] = useState('')

  // Baseline values from DB for change detection
  const [baseline, setBaseline] = useState(null)

  // Animated collapse state for sync details (no measuring, use maxHeight)
  const expand = useSharedValue(0)
  const collapseStyle = useAnimatedStyle(() => {
    const maxHeight = withTiming(expand.value ? 1000 : 0, { duration: 220 })
    const opacity = withTiming(expand.value ? 1 : 0, { duration: 180 })
    return { maxHeight, opacity }
  })

  useEffect(() => {
    const loadUser = async () => {
      const usersCollection = database.get('users')
      const allUsers = await usersCollection.query().fetch()
      let user = allUsers[0]

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

      setUserId(user.id)
      setServerUrl(baseline.serverUrl)
      setUsername(baseline.username)
      setPassword(baseline.password)
      setEncryptionKey(baseline.encryptionKey)
      setSyncFrequency(baseline.syncFrequency)
      setFirstName(baseline.firstName)
      setLastName(baseline.lastName)
      setEmail(baseline.email)
      setSundayWeekStart(baseline.sundayWeekStart)
    }

    loadUser()
  }, [database])

  // Sync expand state with frequency
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
    valuesEqual(!!sundayWeekStart, !!baseline.sundayWeekStart)
  ) : false

  const saveAll = async () => {
    if (!userId || !hasChanges) return
    const user = await database.get('users').find(userId)
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
    // Reset baseline to current values after save
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
            <TextInput style={styles.input} value={serverUrl} onChangeText={setServerUrl} placeholder="https://example.com" />

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

        <Text style={styles.sectionTitle}>{i18n.t('questionnaires')}</Text>
        <Text style={styles.label}>{i18n.t('questionnaire_url')}</Text>
        <TextInput style={styles.input} value={questionnaireUrl} onChangeText={setQuestionnaireUrl} placeholder="https://..." />
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => { alert("Tus ganas") }}>
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
  }
}) 