// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import ReactPlayer from 'react-player/youtube'

import { IYouTubeProps } from 'src/types'

const YouTube = ({ videoId, title, cssClasses }: IYouTubeProps) => (
  <div className={cssClasses}>
    <ReactPlayer
      url={`https://www.youtube.com/embed/${videoId}?showinfo=0`}
      controls
      title={title}
    />
  </div>
)

export default YouTube
