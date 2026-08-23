import React from 'react'
import { Outlet } from 'react-router-dom'

import Jobs from '../component/Jobs'
export default function Navvacc() {
  return (
        <div>
        

        <Jobs></Jobs>
        
      
        <div>
          <Outlet />
        </div>
       
    </div>
  )
}
