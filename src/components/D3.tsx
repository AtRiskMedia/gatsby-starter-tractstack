// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import Neo4jd3 from 'tractstack-neo4jd3'

import { ID3Props } from '../types'

const D3 = ({ options, slug }: ID3Props) => {
  const [thisOptions, setThisOptions] = useState<any>({})
  useEffect(
    function injectD3() {
      if (JSON.stringify(options) !== JSON.stringify(thisOptions)) {
        setThisOptions(options)
      }
      if (thisOptions?.neo4jData) (() => new Neo4jd3(`#${slug}`, thisOptions))()
    },
    [slug, options, thisOptions, setThisOptions],
  )
  return <div id={slug}></div>
}

export default D3
