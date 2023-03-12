import { Compositor } from 'gatsby-plugin-tractstack'

import Menu from '../components/Menu'
import { IStoryFragmentCompositorProps } from '../types'

const storyFragmentCompositor = ({
  data,
  viewportKey,
  hooks,
}: IStoryFragmentCompositorProps) => {
  const storyFragmentId = data.id
  const storyFragmentTitle = data.title
  const storyFragmentSlug = data.field_slug
  const tractStackId = data.relationships.field_tract_stack.id
  const tractStackTitle = data.relationships.field_tract_stack.title
  const tractStackSlug = data.relationships.field_tract_stack.field_slug
  const panesPayload = data.relationships.field_panes
  const tailwindBgColour = data.field_tailwind_background_colour || null
  const payload = {
    panesPayload,
    tailwindBgColour,
    viewportKey,
    hooks,
    id: {
      id: storyFragmentId,
      title: storyFragmentTitle,
      slug: storyFragmentSlug,
      tractStackId,
      tractStackTitle,
      tractStackSlug,
    },
  }
  const storyFragmentPayload = Compositor(payload)
  const menuPayload = data?.relationships?.field_menu
  const compositedMenu = menuPayload
    ? Menu({
        menuPayload,
        viewportKey,
        hooks,
      })
    : null
  return {
    id: storyFragmentId,
    slug: storyFragmentSlug,
    title: storyFragmentTitle,
    tractStackId,
    tractStackSlug,
    tractStackTitle,
    storyFragment: {
      [`${viewportKey}-${storyFragmentId}`]: storyFragmentPayload.storyFragment,
    },
    contentMap: storyFragmentPayload.contentMap,
    contentChildren: {
      ...storyFragmentPayload.contentChildren,
    },
    menu: compositedMenu,
  }
}

export default storyFragmentCompositor
