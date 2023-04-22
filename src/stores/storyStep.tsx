import { create } from 'zustand'
import { navigate } from 'gatsby'

import { config } from '../../data/SiteConfig'
import { IEventStream, IStoryFragmentId, IStoryStepStoreState } from '../types'
import { pushPayload } from '../api/services'

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

export const useStoryStepStore = create<IStoryStepStoreState>((set, get) => ({
  controllerOverride: false,
  setControllerOverride: (controllerOverride: boolean) => {
    set((state) => ({ ...state, controllerOverride }))
  },
  panesVisible: {
    last: false,
  },
  panesRead: {},
  eventStream: {},
  gotoLastPane: [null, null],
  lastStoryStep: null,
  currentStoryStep: null,
  currentStoryStepCount: null,
  storySteps: {},
  pastStorySteps: {},
  processRead: (goto: string, mode: string, parent?: string) => {
    // when goto is set, processRead can apply glossed; else only apply read
    let offset = 0
    const now = Date.now()
    const panesVisible = get().panesVisible
    const panesRead = get().panesRead
    const updatePanesRead = get().updatePanesRead
    const setGotoLastPane = get().setGotoLastPane
    const currentStoryStep = get().currentStoryStep
    if (parent && mode === `context`)
      setGotoLastPane([parent, currentStoryStep])
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
      else if (goto === `#`) {
        const anchor =
          typeof document !== `undefined` && typeof mode === `string`
            ? document.getElementById(mode)
            : null
        anchor?.scrollIntoView({
          behavior: `auto`,
          block: `center`,
          inline: `center`,
        })
      } else navigate(`/${goto}/${viewport}`)
    }
  },
  pushEvent: (payload: IEventStream, storyFragmentId: IStoryFragmentId) => {
    const contentMap = {
      [storyFragmentId.id]: {
        title: storyFragmentId.title,
        type: `StoryFragment`,
        slug: storyFragmentId.slug,
        parentId: storyFragmentId.tractStackId,
        heldBeliefs: {},
        withheldBeliefs: {},
      },
      [storyFragmentId.tractStackId]: {
        title: storyFragmentId.tractStackTitle,
        type: `TractStack`,
        slug: storyFragmentId.tractStackSlug,
        parentId: storyFragmentId.tractStackId,
        heldBeliefs: {},
        withheldBeliefs: {},
      },
    }
    const tractStackId = storyFragmentId.tractStackId
    const eventStream = { push: payload }
    pushPayload({
      eventStream,
      contentMap,
      tractStackId,
    })
  },
  resetGotoLastPane: () => {
    set((state) => ({
      ...state,
      gotoLastPane: [null, null],
    }))
  },
  setGotoLastPane: (gotoLastPane: [string, string]) => {
    set((state) => ({
      ...state,
      gotoLastPane,
    }))
  },
  setLastStoryStep: (last: string, type: string) => {
    const newTimecode = Date.now().toString()
    const newLast = get().currentStoryStep
    set((state) => ({
      storySteps: { ...state.storySteps, [newTimecode]: { type, id: last } },
    }))
    if (last !== newLast) {
      const lastCount = get().currentStoryStepCount
      const newCount = lastCount ? (parseInt(lastCount) + 1).toString() : `0`
      set((state) => ({
        pastStorySteps: {
          ...state.pastStorySteps,
          [newCount]: { timecode: newTimecode },
        },
      }))
      set((state) => ({
        ...state,
        lastStoryStep: newLast,
        currentStoryStep: last,
        currentStoryStepCount: newCount,
      }))
    }
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
