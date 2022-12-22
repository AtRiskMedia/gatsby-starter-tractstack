import { Compositor } from "gatsby-plugin-tractstack"

import Menu from "../components/menu"

const storyFragmentCompositor = props => {
  const viewportKey = props.viewportKey
  const codeHooks = props?.codeHooks || {}
  const hooks = props?.hooks || {}
  const storyFragmentId = props.data.id
  const storyFragmentTitle = props.data.title
  const storyFragmentSlug = props.data.field_slug
  const contextPanesPayload = props.data.relationships.field_context_panes || {}
  const panesPayload = props.data.relationships.field_panes
  const storyFragmentPanes = panesPayload.map(p => {
    return p.id
  })
  const compositedPayload = Compositor(
    panesPayload.concat(contextPanesPayload),
    codeHooks,
    viewportKey,
    hooks
  )
  const hasH5P = compositedPayload?.hasH5P
  const contentMap = compositedPayload?.contentMap || {}
  const menuPayload = props?.data?.relationships?.field_menu
  const compositedMenu = menuPayload
    ? Menu({ menuPayload, viewportKey: viewportKey })
    : false

  return {
    id: storyFragmentId,
    title: storyFragmentTitle,
    slug: storyFragmentSlug,
    panesPayload: compositedPayload,
    storyFragmentPanes: storyFragmentPanes,
    hasH5P: hasH5P,
    menu: compositedMenu,
    contentMap: contentMap,
  }
}

export default storyFragmentCompositor
