import React from 'react'
import { TabsServiceCase } from './components/service-case'
import { ServiceCase } from './components/service-case'

export const Case = () => {
  return (   
    <div>
      <TabsServiceCase></TabsServiceCase>
      <ServiceCase></ServiceCase>
    </div>
  )
}
