import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <Button variant="ghost" size="lg">
        Landing Page (Unprotected)
      </Button>

      <div>
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
        <Link href="/sign-up">
          <Button>SignUp</Button>
        </Link>
      </div>
    </>
  )
}
