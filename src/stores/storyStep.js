import create from "zustand"

export const useStoryStepStore = create(set => ({
  panesVisible: {
    last: false,
    footer: false,
  },
  revealContext: {
    slug: false,
    reveal: undefined,
  },
  eventStream: {},
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
