import { create } from 'zustand'
import { navigate } from 'gatsby'

import { config } from '../../data/SiteConfig'
import { IStoryStepStoreState } from '../types'

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

export const useStoryStepStore = create<IStoryStepStoreState>((set, get) => ({
  panesVisible: {
    last: false,
  },
  panesRead: {},
  eventStream: {},
  gotoLastPane: [null, null],
  lastStoryFragment: null,
  storySteps: {},
  processRead: (goto: string, mode: string, parent?: string) => {
    // when goto is set, processRead can apply glossed; else only apply read
    let offset = 0
    const now = Date.now()
    const panesVisible = get().panesVisible
    const panesRead = get().panesRead
    const updatePanesRead = get().updatePanesRead
    const setGotoLastPane = get().setGotoLastPane
    const lastStoryFragment = get().lastStoryFragment
    if (parent && mode === `context`)
      setGotoLastPane([parent, lastStoryFragment])
    const eventStream = get().eventStream
    const updateEventStream = get().updateEventStream
    const updatePanesVisible = get().updatePanesVisible
    for (const [key, value] of Object.entries(panesVisible)) {
      if (typeof value !== `number`) continue
      const duration = now - value
      const verb =
        (!!goto && duration) > readThreshold || duration > readThreshold * 2
          ? `read`
          : !!goto && duration > softReadThreshold
          ? `glossed`
          : null
      if (key && verb && !panesRead?.key) {
        let when = 0
        while (!when) {
          offset = offset + 1
          if (eventStream[(now - offset).toString()] === undefined)
            when = now - offset
        }
        const eventPayload = {
          verb,
          id: key,
          type: `Pane`,
          duration: duration / 1000,
        }
        updateEventStream(when, eventPayload)
        updatePanesVisible(key, false)
        if (verb === `read`) updatePanesRead(key, true)
      }
    }
    if (typeof goto === `string`) {
      const viewport =
        window?.innerWidth < 801
          ? `600`
          : window?.innerWidth < 1367
          ? `1080`
          : `1920`
      if (goto === `/`)
        navigate(config?.home ? `/${config.home}/${viewport}` : `/`)
      else if (goto[0] === `/`) navigate(goto)
      else navigate(`/${goto}/${viewport}`)
    }
  },
  resetGotoLastPane: () => {
    set((state) => ({
      ...state,
      gotoLastPane: [null, null],
    }))
  },
  setGotoLastPane: () => {
    const lastPane = get().panesVisible.last
    const lastStoryFragment = get().lastStoryFragment
    if (lastPane && lastStoryFragment)
      set((state) => ({
        ...state,
        gotoLastPane: [lastPane, lastStoryFragment],
      }))
  },
  setLastStoryStep: (last: string, type: string) => {
    const key = Date.now().toString()
    set((state) => ({
      storySteps: { ...state.storySteps, [key]: { type, id: last } },
    }))
    if (type === `storyFragment`)
      set((state) => ({ ...state, lastStoryFragment: last }))
  },
  updatePanesRead: (key: string, value: string) =>
    set((state) => ({
      panesRead: { ...state.panesRead, [key]: value },
    })),
  updatePanesVisible: (key: string, value: string) =>
    set((state) => ({
      panesVisible: { ...state.panesVisible, [key]: value },
    })),
  updateEventStream: (key: string, value: any) =>
    set((state) => ({
      eventStream: { ...state.eventStream, [key]: value },
    })),
  updateEventStreamCleanup: (now: number) =>
    set((state) => ({
      eventStream: {
        ...Object.keys(state.eventStream)
          .filter((k) => parseInt(k) > now)
          .reduce((obj: any, key: string) => {
            obj[key] = state.eventStream[key]
            return obj
          }, {}),
      },
    })),
}))
