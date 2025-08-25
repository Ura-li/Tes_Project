import React from 'react'
import { ServiceMaterial } from './services/service-material'
import { ServiceMoDetail } from './services/service-mo_detail'


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