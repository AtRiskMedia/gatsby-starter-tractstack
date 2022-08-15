import { Compositor } from "gatsby-plugin-tractstack"

import Menu from "../components/menu"

const storyFragmentPayload = props => {
  const viewportKey = props.viewportKey
  const setLispActionHook = props.setLispActionHook
  const codeHooks = props?.codeHooks || {}
  const storyFragmentId = props.data.id
  const storyFragmentTitle = props.data.title
  const storyFragmentSlug = props.data.field_slug
  const panesPayload = props.data.relationships.field_panes.sort((a, b) =>
    a?.field_zindex > b?.field_zindex ? 1 : -1
  )
  const compositedPayload = Compositor(
    panesPayload,
    setLispActionHook,
    codeHooks
  )
  const menuPayload = props?.data?.relationships?.field_menu
  const compositedMenu = {
    mobile:
      (menuPayload && Menu({ menuPayload, viewportKey: "mobile" })) || false,
    tablet:
      (menuPayload && Menu({ menuPayload, viewportKey: "tablet" })) || false,
    desktop:
      (menuPayload && Menu({ menuPayload, viewportKey: "desktop" })) || false,
  }
  return {
    id: storyFragmentId,
    title: storyFragmentTitle,
    slug: storyFragmentSlug,
    payload: compositedPayload[viewportKey],
    menu: compositedMenu[viewportKey],
  }
}

export default storyFragmentPayload
