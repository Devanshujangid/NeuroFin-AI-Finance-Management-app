import React from 'react'
import Image from 'next/image'

const banner = () => {
  return (
    <div>
      <Image
        src="/neurofin-banner-one.png"
        alt="NeuroFin - Track, Save, Grow"
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}

export default banner
