import { Compositor } from '@tractstack/helpers'
import { IStoryFragmentCompositorProps } from '@tractstack/types'

import { config } from '../../data/SiteConfig'

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
      home: config.home,
    },
  }
  const storyFragmentPayload = Compositor(payload)
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
  }
}

export default storyFragmentCompositor
