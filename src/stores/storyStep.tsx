import { create } from 'zustand'
import { navigate } from 'gatsby'

import { config } from '../../data/SiteConfig'
import { pushPayload } from '../api/services'
import { IEventStream, IStoryStepStoreState } from '../types'
import { IContentMapDict, IStoryFragmentId } from '@tractstack/types'

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

export const useStoryStepStore = create<IStoryStepStoreState>((set, get) => ({
  entered: false,
  setEntered: (entered: boolean) => {
    set((state) => ({ ...state, entered }))
  },
  controllerOverride: false,
  setControllerOverride: (controllerOverride: boolean) => {
    set((state) => ({ ...state, controllerOverride }))
  },
  withheldPanes: {},
  panesRevealed: false,
  setPanesRevealed: (panesRevealed: boolean) => {
    set((state) => ({
      ...state,
      panesRevealed,
    }))
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
  contentMap: {},
  pastStorySteps: {},
  zoom: false,
  zoomOverride: false,
  setZoom: (zoom: boolean) => {
    set((state) => ({
      ...state,
      zoom,
    }))
  },
  setZoomOverride: (zoomOverride: boolean) => {
    set((state) => ({
      ...state,
      zoomOverride,
    }))
  },
  scrollToPane: ``,
  setScrollToPane: (scrollToPane: string) => {
    set((state) => ({
      ...state,
      scrollToPane,
    }))
  },
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
        (!!goto && duration > readThreshold) || duration > readThreshold * 2
          ? `READ`
          : !!goto && duration > softReadThreshold
            ? `GLOSSED`
            : null
      if (key && verb && !panesRead?.key) {
        let when = 0
        while (!when) {
          offset = offset + 1
          if (eventStream[(now - offset).toString()] === undefined)
            when = now - offset
        }
        const eventPayload: {
          verb: string
          id: string
          type: string
          duration: number
          parentId?: string
        } = {
          verb,
          id: key,
          type: `Pane`,
          duration: duration / 1000,
        }
        if (parent) eventPayload.parentId = parent
        updateEventStream(when, eventPayload)
        updatePanesVisible(key, false)
        if (verb === `READ`) updatePanesRead(key, true)
      }
    }
    if (
      goto === `/` ||
      goto === config.home ||
      (goto === `<` &&
        typeof window !== `undefined` &&
        window.history.state == null)
    )
      navigate(`/`)
    else if (goto === `<`) navigate(-1)
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
    } else if (mode === `context`) navigate(`/context/${goto}`)
    else navigate(`/${goto}/`)
  },
  pushEvent: (payload: IEventStream, storyFragmentId: IStoryFragmentId) => {
    if (
      typeof storyFragmentId.id === `string` &&
      typeof storyFragmentId.title === `string` &&
      typeof storyFragmentId.slug === `string` &&
      typeof storyFragmentId.tractStackId === `string` &&
      typeof storyFragmentId.tractStackTitle === `string` &&
      typeof storyFragmentId.tractStackSlug === `string`
    ) {
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
    } else {
      console.log(`MISS in pushEvent on:`, storyFragmentId, payload)
    }
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
  updateContentMap: (values: IContentMapDict) =>
    set((state) => ({
      contentMap: { ...state.contentMap, ...values },
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
  toggleWithheldPanes: (key: string, value: boolean) =>
    set((state) => ({
      withheldPanes: { ...state.withheldPanes, [key]: value },
    })),
}))
