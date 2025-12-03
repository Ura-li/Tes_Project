import { Case_table } from '@/pages/master_table'
import React from 'react'

export const ViewCase = () => {
  return (
    <div className='p-6 md:p-3 bg-gradient-to-t  dark:from-slate-800 dark:via-slate-600 dark:to-slate-800 dark:to-70% dark:via-6% dark:from-1% flex flex-col items-center justify-center space-y-6 h-full'>
        {/* <h1 className="text-4xl font-semibold">View Case</h1> */}
        <Case_table/>
    </div>
  )
}
