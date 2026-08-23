import React from 'react'
import { Outlet } from 'react-router-dom'
import Navvvv from "../pages/Navvvv";
export default function Homenavvv() {
  return (
        <div>
        

        <Navvvv></Navvvv>
        
      
        <div>
          <Outlet />
        </div>
       
    </div>
  )
}
