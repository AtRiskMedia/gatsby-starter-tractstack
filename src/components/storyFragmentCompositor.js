import { Compositor } from "gatsby-plugin-tractstack"

import Menu from "../components/menu"

const storyFragmentCompositor = props => {
  const viewportKey = props.viewportKey
  const codeHooks = props?.codeHooks || {}
  const storyFragmentId = props.data.id
  const storyFragmentTitle = props.data.title
  const storyFragmentSlug = props.data.field_slug
  const contextPanesPayload = props.data.relationships.field_context_panes
  const panesPayload = props.data.relationships.field_panes
  const compositedPayload = Compositor(panesPayload, codeHooks, viewportKey)
  const compositedContextPayload = Compositor(
    contextPanesPayload,
    codeHooks,
    viewportKey
  )
  const menuPayload = props?.data?.relationships?.field_menu
  const compositedMenu = menuPayload
    ? Menu({ menuPayload, viewportKey: viewportKey })
    : false

  return {
    id: storyFragmentId,
    title: storyFragmentTitle,
    slug: storyFragmentSlug,
    payload: compositedPayload,
    contextPayload: compositedContextPayload,
    menu: compositedMenu,
  }
}

export default storyFragmentCompositor
