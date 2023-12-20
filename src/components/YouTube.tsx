// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, Fragment } from 'react'
import { PlayIcon } from '@heroicons/react/20/solid'
import { classNames } from '@tractstack/helpers'

import { IYouTubeProps } from 'src/types'

const YouTube = ({ videoId, title, cssClasses }: IYouTubeProps) => {
  const [playVideo, setPlayVideo] = useState(false)
  const width = `100%`
  const height = `100%`
  const imgSize = `hqdefault` // or mqdefault for medium
  const poster = `https://img.youtube.com/vi/${videoId}/${imgSize}.jpg`
  return (
    <Fragment>
      {playVideo ? (
        <div className={classNames(cssClasses, `w-full aspect-video`)}>
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
        <div className={classNames(cssClasses, `w-full h-full aspect-video`)}>
          <button
            onClick={() => setPlayVideo(true)}
            className="group w-full h-full"
          >
            <div className="relative">
              <div className="flex items-center justify-center absolute w-full h-full">
                <div className="rounded-md z-70030 bg-black opacity-50 group-hover:opacity-75">
                  <PlayIcon className="w-16 h-16 relative z-70030 text-white opacity-100" />
                </div>
              </div>
              <img
                className="w-full h-full rounded-md aspect-video object-cover group-hover:-rotate-1 scale-90 group-hover:scale-95 transition duration-50"
                src={poster}
                title={title}
              />
            </div>
          </button>
        </div>
      )}
    </Fragment>
  )
}

export default YouTube
