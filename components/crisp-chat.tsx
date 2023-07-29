'use client'

import { useEffect } from 'react'
import { Crisp } from 'crisp-sdk-web'

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure('3fc0f4cc-2700-4161-8851-0705050173df')
  }, [])

  return null
}
