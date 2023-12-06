import { client } from './axiosClient'
import {
  IAxiosProfileProps,
  IAxiosPushProps,
  IAxiosRegisterProps,
} from '../types'

export async function register({
  fingerprint,
  codeword,
  email,
  encryptedEmail,
  encryptedCode,
  referrer,
}: IAxiosRegisterProps) {
  const payload = {
    fingerprint: fingerprint.toString(),
    codeword,
    email,
    encryptedEmail,
    encryptedCode,
    referrer,
  }
  const options: any = { authorization: false }
  return client.post(`/auth/register`, payload, options)
}

export async function pushPayload({
  eventStream,
  contentMap,
  tractStackId,
}: IAxiosPushProps) {
  const nodes: any = {}
  Object.keys(eventStream).forEach((key) => {
    let matchPane: string = ``
    let matchStoryFragment: string = ``
    let matchTractStack: string = ``
    let e: any
    const thisEventStream: any = eventStream[key]
    switch (thisEventStream.type) {
      case `H5P`: // match "pane" on parentId
        e = eventStream[key]
        if (e?.id && typeof e.id === `string` && e.targetId)
          nodes[e.id] = {
            title: e?.title,
            type: `H5P`,
            parentId: e?.targetId,
          }
        matchPane = e.targetId
        break

      case `Impression`: // match "StoryFragment" on targetId
        e = eventStream[key]
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
        matchPane = thisEventStream.id
        break

      case `MenuItem`: {
        // match "StoryFragment" on targetSlug
        let lookup: string = ``
        e = eventStream[key]
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
          e = eventStream[key]
          if (e?.id && !nodes[e.id])
            nodes[e.id] = {
              title: e?.title,
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
          contentMap[thisEventStream.id],
        )
        break
    }

    if (key === `contextPane`) {
      nodes[matchPane] = {
        title: eventStream[key].title,
        slug: tractStackId,
        type: `Pane`,
      }
    } else {
      if (matchTractStack && !nodes?.matchTractStack)
        nodes[matchTractStack] = {
          title: contentMap[matchTractStack]?.title,
          type: contentMap[matchTractStack]?.type,
          slug: contentMap[matchTractStack]?.slug,
        }
      if (matchPane && !nodes?.matchPane) {
        nodes[matchPane] = {
          title: contentMap[matchPane]?.title,
          slug: contentMap[matchPane]?.slug,
          type: contentMap[matchPane]?.type,
          parentId: contentMap[matchPane]?.parentId,
        }
        matchStoryFragment = contentMap[matchPane]?.parentId
      }
      if (matchStoryFragment && !nodes?.matchStoryFragment) {
        nodes[matchStoryFragment] = {
          title: contentMap[matchStoryFragment]?.title,
          slug: contentMap[matchStoryFragment]?.slug,
          type: contentMap[matchStoryFragment]?.type,
          parentId: contentMap[matchStoryFragment]?.parentId,
        }
        matchTractStack = contentMap[matchStoryFragment]?.parentId
        if (matchTractStack && !nodes?.matchTractStack)
          nodes[matchTractStack] = {
            title: contentMap[matchTractStack]?.title,
            type: contentMap[matchTractStack]?.type,
            slug: contentMap[matchTractStack]?.slug,
          }
      }
    }
  })

  return client.post(`/users/eventStream`, {
    nodes,
    events: eventStream,
  })
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
