import { client } from './axiosClient'
import {
  IAxiosProfileProps,
  IAxiosPushProps,
  IAxiosRegisterProps,
} from '../types'

export async function conciergeSync({
  codeword,
  email,
  encryptedEmail,
  encryptedCode,
  referrer,
  fingerprint,
}: IAxiosRegisterProps) {
  const payload = {
    codeword,
    email,
    encryptedEmail,
    encryptedCode,
    referrer,
    fingerprint,
  }
  const options: any = { authorization: false }
  return client.post(`/auth/sync`, payload, options)
}

export async function pushPayload({
  eventStream,
  contentMap,
  tractStackId,
  referrer,
}: IAxiosPushProps) {
  const nodes: any = {}
  const events: any = {}
  Object.keys(eventStream).forEach((key) => {
    events[key] = { ...eventStream[key] }
    Object.keys(contentMap).forEach((e: any) => {
      if (contentMap[e].slug === events[key].targetSlug)
        events[key].parentId = e
    })
    if (typeof events[key].title !== `undefined`) delete events[key].title
    if (typeof events[key].slug !== `undefined`) delete events[key].slug
    if (typeof events[key].targetSlug !== `undefined`)
      delete events[key].targetSlug
    let matchPane: string = ``
    let matchStoryFragment: string = ``
    let matchTractStack: string = ``
    const e: any = events[key]

    switch (e.type) {
      case `H5P`: // match "pane" on parentId
        if (e?.id && typeof e.id === `string` && e.targetId)
          nodes[e.id] = {
            title: e?.title,
            type: `H5P`,
            parentId: e?.targetId || e?.parentId,
          }
        matchPane = e?.targetId || e?.parentId
        break

      case `Impression`: // match "StoryFragment" on targetId
        if (e?.id && typeof e.id === `string` && e?.targetId) {
          nodes[e.id] = {
            title: e?.title,
            type: `Impression`,
            parentId: e.targetId,
          }
          matchPane = e.targetId
        }
        break

      case `Pane`: // match "Pane" on id, then StoryFragment and TractStack
      case `Context`: // match "Pane" on id, then StoryFragment and TractStack
      case `StoryFragment`: // match StoryFragment on id
        if (e.verb === `CONNECTED` && e.parentId)
          nodes[e.parentId] = {
            title: contentMap[e.parentId].title,
            slug: contentMap[e.parentId].slug,
            type: contentMap[e.parentId].type,
            parentId: contentMap[e.parentId].parentId,
          }
        matchPane = e.id
        break

      case `MenuItem`: {
        // match "StoryFragment" on targetSlug
        let lookup: string = ``
        let k: keyof typeof contentMap
        for (k in contentMap) {
          const thisSlug = contentMap[k]
          if (thisSlug === e?.targetSlug) lookup = key
        }
        if (lookup && typeof lookup === `string`)
          nodes[e.id] = {
            title: e?.title,
            type: `MenuItem`,
            parentId: lookup,
          }
        matchStoryFragment = lookup
        break
      }

      case `Belief`: // no match required
        if (tractStackId) {
          matchTractStack = tractStackId
          if (e?.id && !nodes[e.id])
            nodes[e.id] = {
              title: e.id,
              type: `Belief`,
              parentId: tractStackId,
            }
        }
        break

      default:
        console.log(
          `bad event handler type`,
          key,
          eventStream[key],
          events[key],
          contentMap[e.id],
        )
        break
    }

    if (matchTractStack && !nodes?.matchTractStack) {
      nodes[matchTractStack] = {
        title: contentMap[matchTractStack].title,
        type: contentMap[matchTractStack].type,
        slug: contentMap[matchTractStack].slug,
      }
    }
    if (matchPane && !nodes?.matchPane) {
      matchStoryFragment = contentMap[matchPane]?.parentId
      if (typeof contentMap[matchPane] === `undefined`)
        nodes[matchPane] = {
          title: e.title,
          slug: e.slug,
          type: `Pane`,
        }
      else
        nodes[matchPane] = {
          title: contentMap[matchPane].title,
          slug: contentMap[matchPane].slug,
          type: contentMap[matchPane].type,
          parentId: contentMap[matchPane].parentId,
        }
    }
    if (matchStoryFragment && !nodes?.matchStoryFragment) {
      nodes[matchStoryFragment] = {
        title: contentMap[matchStoryFragment].title,
        slug: contentMap[matchStoryFragment].slug,
        type: contentMap[matchStoryFragment].type,
        parentId: contentMap[matchStoryFragment].parentId,
      }
      matchTractStack = contentMap[matchStoryFragment].parentId
      if (matchTractStack && !nodes?.matchTractStack) {
        nodes[matchTractStack] = {
          title: contentMap[matchTractStack].title,
          type: contentMap[matchTractStack].type,
          slug: contentMap[matchTractStack].slug,
        }
      }
    }
  })

  if (process.env.NODE_ENV !== `development`)
    try {
      const response = await client.post(`/users/eventStream`, {
        nodes,
        events,
        referrer,
      })
      return { success: true, data: response }
    } catch {
      return { error: true }
    }
  return null
}

export async function getGraph() {
  return client.get(`/users/graph`)
}

export async function loadProfile() {
  return client.get(`/users/profile`)
}

export async function saveProfile({ profile }: IAxiosProfileProps) {
  return client.post(`/users/profile`, profile)
}
