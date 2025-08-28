import React from 'react'
// import { ServiceMaterial } from './services/service-material'
// import { ServiceMoDetail } from './services/service-mo_detail'
import { ServiceMaterialApo } from './services/service-materialApo'
import { ServiceMoDetailApo } from './services/service-mo_detailApo'

export const MaterialOrder = () => {
  return (
    <div>
        {/* <ServiceMaterial></ServiceMaterial> */}
        <ServiceMaterialApo/>
    </div>
  )
}

export const MoDetail = () => {
  return (
    <div>
        {/* <ServiceMoDetail></ServiceMoDetail> */}
        <ServiceMoDetailApo/>
    </div>
  )
}