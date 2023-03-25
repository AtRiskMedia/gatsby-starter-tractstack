// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, Fragment } from 'react'
import { classNames } from 'gatsby-plugin-tractstack'

import { IYouTubeProps } from 'src/types'

const YouTube = ({ videoId, title, cssClasses }: IYouTubeProps) => {
  const [playVideo, setPlayVideo] = useState(false)
  const width = `100%`
  const height = `100%`
  const imgSize = `hqdefault`
  return (
    <Fragment>
      {playVideo ? (
        <div className={classNames(`w-full aspect-video`, cssClasses)}>
          <iframe
            width={width || `100%`}
            height={height || `400px`}
            title={`Iframe embed from YouTube | ${title}`}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&showinfo=0`}
            allow="autoplay"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="w-full aspect-video">
          <button
            className="youtubeposter"
            style={{
              backgroundImage: `url(${`https://img.youtube.com/vi/${videoId}/${
                imgSize || `mqdefault`
              }.jpg`})`,
              width,
              height,
            }}
            onClick={() => setPlayVideo(true)}
          >
            <div className="playButton" />
          </button>
        </div>
      )}
    </Fragment>
  )
}

export default YouTube
