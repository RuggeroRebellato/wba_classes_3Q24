import type { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { requireUser } from '@/modules/auth/auth.server'
import { ROUTE_PATH as ONBOARDING_USERNAME_PATH } from '@/routes/onboarding+/username'
import { Navigation } from '@/components/navigation'
import { Header } from '@/components/header'

export const ROUTE_PATH = '/dashboard' as const

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)
  if (!user.username) return redirect(ONBOARDING_USERNAME_PATH)
  const subscription = { planId: 'pontos.gratis' }
  return json({ user, subscription } as const)
}

export default function Dashboard() {
  const { user, subscription } = useLoaderData<typeof loader>()

  return (
    <div className="flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black">
      <Navigation user={user} planId={subscription?.planId} />
      <Header />
      <Outlet />
    </div>
  )
}
