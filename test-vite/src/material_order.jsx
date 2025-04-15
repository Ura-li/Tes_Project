import React from 'react'
import { ServiceMaterial } from './components/service-material'
import { ServiceMoDetail } from './components/service-mo_detail'


export const MaterialOrder = () => {
  return (
    <div>
        <ServiceMaterial></ServiceMaterial>
    </div>
  )
}

export const MoDetail = () => {
  return (
    <div>
        <ServiceMoDetail></ServiceMoDetail>
    </div>
  )
}