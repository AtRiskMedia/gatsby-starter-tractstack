// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'
import { Network } from 'vis-network'

const VisNetwork = ({ payload }: any) => {
  useEffect(() => {
    const container = document.getElementById(`mynetwork`)
    const options = {
      nodes: {
        shape: `dot`,
        scaling: {
          label: {
            min: 8,
            max: 20,
          },
        },
      },
    }
    if (container) {
      const network = new Network(container, payload, options)
      network.on(`click`, function (params) {
        const nid = params?.nodes?.length > 0 ? params.nodes[0] : null
        if (nid) {
          const thisNode = payload.nodes.filter((e: any) => nid === e.id)
          if (thisNode.length) console.log(`clicked`, thisNode[0])
        }
      })
    }
  }, [payload])

  return <div id="mynetwork" className="w-full h-full"></div>
}

export default VisNetwork
