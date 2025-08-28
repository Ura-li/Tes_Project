import React from 'react'
import { ServiceBooking } from './pages/services/service-booking'
import { useLocation } from 'react-router';
import { ServiceBookingApo } from './pages/services/service-bookingApo';


export const Bookings = () => {
  const location = useLocation();
  const bookingId = location.state?.BookingId;
  const woid = location.state?.WOID;
  return (
    <div>
        {/* <ServiceBooking BookingId={bookingId} woid={woid}></ServiceBooking> */}
        <ServiceBookingApo BookingId={bookingId} woid={woid}></ServiceBookingApo>
    </div>
  )
}
