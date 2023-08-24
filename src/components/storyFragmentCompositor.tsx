import { Compositor } from 'gatsby-plugin-tractstack'

import Menu from '../components/Menu'
import { IStoryFragmentCompositorProps } from 'gatsby-plugin-tractstack/types'

const storyFragmentCompositor = ({
  data,
  viewportKey,
  hooks,
}: IStoryFragmentCompositorProps) => {
  const storyFragmentId = data.id
  const storyFragmentTitle = data.title
  const storyFragmentSlug = data.slug
  const tractStackId = data.relationships.tractstack.id
  const tractStackTitle = data.relationships.tractstack.title
  const tractStackSlug = data.relationships.tractstack.slug
  const panesPayload = data.relationships.panes
  const tailwindBgColour = data.tailwindBgColour || null
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
  const menuPayload = data?.relationships?.menu
  const compositedMenu = menuPayload
    ? Menu({
        menuPayload,
        viewportKey,
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
