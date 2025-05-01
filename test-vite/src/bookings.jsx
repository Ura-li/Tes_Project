import React from 'react'
import { ServiceBooking } from './components/service-booking'
// import { useLocation } from 'react-router-dom';
import { useLocation } from 'react-router';


export const Bookings = () => {
  const location = useLocation();
  const bookingId = location.state?.BookingId;
  const woid = location.state?.WOID;
  return (
    <div>
        <ServiceBooking BookingId={bookingId} woid={woid}></ServiceBooking>
    </div>
  )
}
