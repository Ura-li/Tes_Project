import { Case_table } from '@/pages/master_table'
import React from 'react'

export const ViewCase = () => {
  return (
    <div className='p-6 md:p-10 bg-muted flex flex-col items-center justify-center min-h-screen'>
        <h1 className="text-2xl font-bold">View Case</h1>
        <Case_table/>
    </div>
  )
}
