"use client"
import { useState } from 'react'
import HeroSection from '@/components/HeroSection'
import DesignGallery from '@/components/DesignGallery'

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div>
      <HeroSection onDesignSaved={() => setRefreshKey(prev => prev + 1)} />
      <DesignGallery key={refreshKey} />
    </div>
  )
}

export default Home