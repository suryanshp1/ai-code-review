import { requireAuth } from '@/features/auth/actions'
import { getInstallatiomStatus } from '@/features/github/server/installation'
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { GithubConnectCard } from '@/features/github/components/github-connect-card';
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "GitHub App - Dashboard",
}

const DashboardGithubPage = async () => {
  const session = await requireAuth()

  const installation = await getInstallatiomStatus(session.user.id)



  return (
    <>
      <DashboardHeader
        title="GitHub App"
        description="Install or disconnect the reviewer app on your GitHub account."
      />
      <GithubConnectCard userId={session.user.id} installation={installation} />
    </>
  )
}

export default DashboardGithubPage