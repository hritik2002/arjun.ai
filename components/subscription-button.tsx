'use client'

import axios from 'axios'
import { Zap } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { Button } from './ui/button'

interface SubscriptionButtonProps {
  isPro: boolean
}

export const SubscriptionButton = ({
  isPro = false,
}: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/stripe')

      window.location.href = response.data.url
    } catch (error: any) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      disabled={loading}
      onClick={onClick}
      variant={isPro ? 'default' : 'premium'}
    >
      {isPro ? 'Manage Subscription' : 'Upgrade'}
      {isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  )
}
