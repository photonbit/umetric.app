import axios from 'axios'
import { Q } from '@nozbe/watermelondb'

// See the namespace and context definitions
// in https://umetric.app/ns and https://umetric.app/id
// or in assets/vocab

export async function importQuestionnaireFromJsonLD(database, json) {
  const qCollection = database.get('questionnaires')
  const lsCollection = database.get('likert_scales')
  const qnCollection = database.get('questions')
  const qlCollection = database.get('question_likert')
  const qnTrCollection = database.get('questionnaire_translations')
  const lsTrCollection = database.get('likert_scale_translations')
  const quTrCollection = database.get('question_translations')

  let createdQuestionnaire = null
  const likertIriToRecordId = new Map()
  const questionIriToRecordId = new Map()

  await database.write(async () => {
    // Upsert questionnaire
    const questionnaireIri = json['@id']
    if (questionnaireIri) {
      try {
        const existing = await qCollection.find(String(questionnaireIri))
        createdQuestionnaire = existing
        await existing.update((q) => {
          q.name = json.name
          q.shortName = json.shortName
          q.description = json.description || null
          q.instructions = json.instructions || null
          q.source = json.source || null
          q.language = json.inLanguage
        })
      } catch (_) {
        createdQuestionnaire = await qCollection.create((q) => {
          q._raw.id = String(questionnaireIri)
          q.name = json.name
          q.shortName = json.shortName
          q.description = json.description || null
          q.instructions = json.instructions || null
          q.source = json.source || null
          q.language = json.inLanguage
        })
      }
    } else {
      createdQuestionnaire = await qCollection.create((q) => {
        q.name = json.name
        q.shortName = json.shortName
        q.description = json.description || null
        q.instructions = json.instructions || null
        q.source = json.source || null
        q.language = json.inLanguage
      })
    }

    // Create likert scales
    if (Array.isArray(json.hasLikertScale)) {
      for (const likertScaleIri of json.hasLikertScale) {
        if (typeof likertScaleIri !== 'string') {
          throw new Error('hasLikertScale must be a list of IRIs (strings)')
        }
        const iri = String(likertScaleIri)
        const resp = await axios.get(iri)
        const ls = resp.data
        if (!ls || ls['@type'] !== 'LikertScale') {
          throw new Error(`Invalid LikertScale at ${iri}`)
        }
        const scaleIri = String(ls['@id'] || iri)
        const scaleLanguage = ls.inLanguage || json.inLanguage
        
        // Reuse if already exists; do not overwrite fields for now
        let rec
        try {
          rec = await lsCollection.find(scaleIri)
        } catch (_) {
          rec = await lsCollection.create((l) => {
            l._raw.id = scaleIri
            l.language = scaleLanguage
            l.choices = numberOr(ls.choices, 5)
            l.slope = numberOr(ls.slope, 1)
            l.intercept = numberOr(ls.intercept, 0)
            l.description = nullable(ls.description)
            l.measure = nullable(ls.measure)
            l.lowerChoiceLabel = nullable(ls.lowerChoiceLabel)
            l.upperChoiceLabel = nullable(ls.upperChoiceLabel)
            l.middleChoiceLabel = nullable(ls.middleChoiceLabel)
            l.questionnaire.set(createdQuestionnaire)
          })
        }
        likertIriToRecordId.set(scaleIri, rec.id)
      }
    }

    // Create questions
    if (Array.isArray(json.hasQuestion)) {
      for (const question of json.hasQuestion) {
        const questionIri = question['@id']
        const questionLanguage = question.inLanguage || json.inLanguage
        
        let rec
        if (questionIri) {
          try {
            const existingQ = await qnCollection.find(String(questionIri))
            rec = existingQ
            await existingQ.update((qn) => {
              qn.order = numberOr(question.order, 0)
              qn.text = question.text
              qn.language = questionLanguage
              qn._raw.questionnaire_id = createdQuestionnaire.id
            })
          } catch (_) {
            rec = await qnCollection.create((qn) => {
              qn._raw.id = String(questionIri)
              qn.order = numberOr(question.order, 0)
              qn.text = question.text
              qn.language = questionLanguage
              qn._raw.questionnaire_id = createdQuestionnaire.id
            })
          }
        } else {
          rec = await qnCollection.create((qn) => {
            qn.order = numberOr(question.order, 0)
            qn.text = question.text
            qn.language = questionLanguage
            qn._raw.questionnaire_id = createdQuestionnaire.id
          })
        }
        if (questionIri) questionIriToRecordId.set(String(questionIri), rec.id)
        
        // Link likert scales
        if (Array.isArray(question.usesLikertScale)) {
          for (const linkIri of question.usesLikertScale) {
            const lsRecordId = likertIriToRecordId.get(String(linkIri))
            if (!lsRecordId) {
              throw new Error(`Unknown likertScale iri reference: ${linkIri}`)
            }
            // Avoid duplicate links
            const existingLinks = await qlCollection
              .query(
                Q.where('question_id', rec.id),
                Q.where('likert_scale_id', lsRecordId)
              )
              .fetch()
            if (existingLinks.length === 0) {
              await qlCollection.create((ql) => {
                ql._raw.question_id = rec.id
                ql._raw.likert_scale_id = lsRecordId
              })
            }
          }
        }
      }
    }

    // Translations (optional)
    if (json.translations) {
      if (Array.isArray(json.translations.questionnaire)) {
        for (const t of json.translations.questionnaire) {
          await qnTrCollection.create((tr) => {
            tr._raw.questionnaire_id = createdQuestionnaire.id
            tr.language = t.language
            tr.name = t.name
            tr.description = nullable(t.description)
            tr.instructions = nullable(t.instructions)
            tr.shortName = createdQuestionnaire.shortName
          })
        }
      }
      if (Array.isArray(json.translations.likertScales)) {
        for (const t of json.translations.likertScales) {
          const lsRecordId = likertIriToRecordId.get(String(t.ref))
          if (!lsRecordId) continue
          await lsTrCollection.create((tr) => {
            tr._raw.likert_scale_id = lsRecordId
            tr.language = t.language
            tr.description = nullable(t.description)
            tr.measure = nullable(t.measure)
            tr.lowerChoiceLabel = nullable(t.lowerChoiceLabel)
            tr.upperChoiceLabel = nullable(t.upperChoiceLabel)
            tr.middleChoiceLabel = nullable(t.middleChoiceLabel)
          })
        }
      }
      if (Array.isArray(json.translations.questions)) {
        for (const t of json.translations.questions) {
          let qRecordId = null
          if (t.ref && questionIriToRecordId.has(String(t.ref))) {
            qRecordId = questionIriToRecordId.get(String(t.ref))
          } else if (typeof t.order === 'number') {
            // Fallback: find by order
            const found = await qnCollection
              .query()
              .fetch()
            const match = found.find((qq) => qq.order === t.order && qq.questionnaire_id === createdQuestionnaire.id)
            qRecordId = match ? match.id : null
          }
          if (!qRecordId) continue
          await quTrCollection.create((tr) => {
            tr._raw.question_id = qRecordId
            tr.language = t.language
            tr.text = t.text
          })
        }
      }
    }
  })

  return createdQuestionnaire
}

export async function importQuestionnaireFromUrl(database, url) {
  const resp = await axios.get(url)
  return await importQuestionnaireFromJsonLD(database, resp.data)
}

function numberOr(value, fallback) {
  return typeof value === 'number' ? value : fallback
}

function nullable(v) {
  return v == null ? null : v
}
