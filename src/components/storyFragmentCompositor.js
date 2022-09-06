import { Compositor } from "gatsby-plugin-tractstack"

import Menu from "../components/menu"

const storyFragmentCompositor = props => {
  const viewportKey = props.viewportKey
  const setLispActionHook = props.setLispActionHook
  const codeHooks = props?.codeHooks || {}
  const storyFragmentId = props.data.id
  const storyFragmentTitle = props.data.title
  const storyFragmentSlug = props.data.field_slug
  const panesPayload = props.data.relationships.field_panes
  const compositedPayload = Compositor(
    panesPayload,
    setLispActionHook,
    codeHooks
  )
  const menuPayload = props?.data?.relationships?.field_menu
  const compositedMenu = {
    mobile:
      (menuPayload &&
        Menu({ menuPayload, viewportKey: "mobile", setLispActionHook })) ||
      false,
    tablet:
      (menuPayload &&
        Menu({ menuPayload, viewportKey: "tablet", setLispActionHook })) ||
      false,
    desktop:
      (menuPayload &&
        Menu({ menuPayload, viewportKey: "desktop", setLispActionHook })) ||
      false,
  }
  return {
    id: storyFragmentId,
    title: storyFragmentTitle,
    slug: storyFragmentSlug,
    payload: compositedPayload[viewportKey],
    menu: compositedMenu[viewportKey],
  }
}

export default storyFragmentCompositor
