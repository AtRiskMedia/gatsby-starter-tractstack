import { Compositor } from "gatsby-plugin-tractstack"

import Menu from "../components/menu"

const storyFragmentCompositor = props => {
  const viewportKey = props.viewportKey
  const codeHooks = props?.codeHooks || {}
  const storyFragmentId = props.data.id
  const storyFragmentTitle = props.data.title
  const storyFragmentSlug = props.data.field_slug
  const panesPayload = props.data.relationships.field_panes
  const compositedPayload = Compositor(panesPayload, codeHooks)
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

export default storyFragmentCompositor
