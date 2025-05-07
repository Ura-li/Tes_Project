import React from 'react'
import { ServiceMaterial } from './components/service'
import { ServiceMoDetail } from './components/service'

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