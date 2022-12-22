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
    const now = Date.now()
    const panesVisible = get().panesVisible
    const updatePanesVisibleCleanup = get().updatePanesVisibleCleanup
    const contentMap = get().contentMap
    const updateEventStream = get().updateEventStream
    console.log("processRead")
    console.log('last', panesVisible.last, contentMap[panesVisible.last])
    for (const [key, value] of Object.entries(panesVisible)) {
      if (key === "last" || key === "footer") continue
      console.log(key, (now - value) / 1000, contentMap[key], panesVisible[key])
      const duration = now - value
      const verb =
        duration > readThreshold
          ? "read"
          : duration > softReadThreshold
            ? "glossedOver"
            : null
      if (verb) {
        updateEventStream(Date.now(), {
          verb: verb,
          object_name: contentMap[key].slug,
          object_id: contentMap[key].id,
          object_type: contentMap[key].type,
          duration: duration / 1000,
        })
      }
      updatePanesVisibleCleanup()
    }
  },
  updateContentMap: (key, value) =>
    set(state => ({
      contentMap: { ...state.contentMap, [key]: value },
    })),
  updatePanesVisible: (key, value) =>
    set(state => ({
      panesVisible: { ...state.panesVisible, [key]: value },
    })),
  updatePanesVisibleCleanup: () =>
    set(() => ({
      panesVisible: {
        last: false,
        footer: false,
      },
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
