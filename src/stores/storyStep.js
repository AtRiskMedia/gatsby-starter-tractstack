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
  processRead: bypass => {
    let offset = 0
    const now = Date.now()
    const panesVisible = get().panesVisible
    const updatePanesVisible = get().updatePanesVisible
    const updatePanesVisibleCleanup = get().updatePanesVisibleCleanup
    const contentMap = get().contentMap
    const eventStream = get().eventStream
    const updateEventStream = get().updateEventStream
    for (const [key, value] of Object.entries(panesVisible)) {
      if (key === "last" || key === "footer" || typeof value !== "number")
        continue
      const duration = now - value
      const verb =
        duration > readThreshold
          ? "read"
          : duration > softReadThreshold && bypass !== true
          ? "glossedOver"
          : null
      if (verb) {
        let when = 0
        while (!when) {
          offset = offset + 1
          if (eventStream[(now - offset).toString()] === undefined)
            when = now - offset
        }
        console.log({
          verb: verb,
          object_name: contentMap[key].slug,
          object_id: contentMap[key].id,
          object_type: contentMap[key].type,
          duration: duration / 1000,
          tractStackId: contentMap[key].tractStackId,
          tractStackSlug: contentMap[key].tractStackSlug,
          storyFragmentId: contentMap[key].storyFragmentId,
          storyFragmentSlug: contentMap[key].storyFragmentSlug,
        })
        updateEventStream(when, {
          verb: verb,
          object_name: contentMap[key].slug,
          object_id: contentMap[key].id,
          object_type: contentMap[key].type,
          duration: duration / 1000,
          tractStackId: contentMap[key].tractStackId,
          tractStackSlug: contentMap[key].tractStackSlug,
          storyFragmentId: contentMap[key].storyFragmentId,
          storyFragmentSlug: contentMap[key].storyFragmentSlug,
        })
        if (bypass) {
          updatePanesVisible("last", false)
          updatePanesVisible(key, false)
        }
      }
      if (bypass !== true) updatePanesVisibleCleanup()
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
