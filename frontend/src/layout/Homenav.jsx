import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../component/Navbar'
export default function Homenav() {
  return (
        <div>
        

        
        <Navbar></Navbar>
      
        <div>
          <Outlet />
        </div>
       
    </div>
  )
}
