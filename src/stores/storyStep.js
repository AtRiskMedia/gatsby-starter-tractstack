import create from "zustand"

import config from "../../data/SiteConfig"

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

export const useStoryStepStore = create((set, get) => ({
  panesVisible: {
    last: false,
    footer: false,
  },
  revealContext: {
    slug: false,
    reveal: undefined,
  },
  eventStream: {},
  contentMap: {},
  processRead: () => {
    const panesVisible = get().panesVisible
    const contentMap = get().contentMap
    const updateEventStream = get().updateEventStream
    const last =
      typeof panesVisible["last"] === "string" ? panesVisible["last"] : false
    const duration =
      typeof last === "string" ? Date.now() - panesVisible[last] : false
    console.log('processRead')
    console.log(last, duration)
    if (duration > readThreshold)
      updateEventStream(Date.now(), {
        verb: "read",
        object_name: contentMap[last].slug || `Unknown`,
        object_id: contentMap[last].id,
        object_type: contentMap[last].type,
        duration: duration / 1000,
      })
    else if (duration > softReadThreshold)
      updateEventStream(Date.now(), {
        verb: "glossedOver",
        object_name: contentMap[last].slug || `Unknown`,
        object_id: contentMap[last].id,
        object_type: contentMap[last].type,
        duration: duration / 1000,
      })
  },
  updateContentMap: (key, value) =>
    set(state => ({
      contentMap: { ...state.contentMap, [key]: value },
    })),
  updatePanesVisible: (key, value) =>
    set(state => ({
      panesVisible: { ...state.panesVisible, [key]: value },
    })),
  updateRevealContext: (key, value) =>
    set(state => ({
      revealContext: { ...state.revealContext, [key]: value },
    })),
  updateEventStream: (key, value) =>
    set(state => ({
      eventStream: { ...state.eventStream, [key]: value },
    })),
  updateEventStreamCleanup: lastSync =>
    set(state => ({
      eventStream: {
        ...Object.keys(state.eventStream)
          .filter(k => k > lastSync)
          .reduce((obj, key) => {
            obj[key] = state.eventStream[key]
            return obj
          }, {}),
      },
    })),
}))
