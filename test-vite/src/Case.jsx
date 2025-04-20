<<<<<<< Updated upstream
import React from 'react'
import { ServiceCase } from './components/service-case'
=======
import React, { useEffect, useState } from 'react'
import { 
  ServiceCase,
  TabsService
 } from './components/service-case'
import { useParams } from 'react-router'
import ApiCustomer from './api'
>>>>>>> Stashed changes

export const Case = () => {
  return (
    <ServiceCase></ServiceCase>
  )
}