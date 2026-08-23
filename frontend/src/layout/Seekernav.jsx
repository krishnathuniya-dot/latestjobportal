import React from 'react'
import { Outlet } from 'react-router-dom'

import NNNavv from '../pages/NNNavv'
export default function Seekernav() {
  return (
        <div>
        

       <NNNavv></NNNavv>
        
      
        <div>
          <Outlet />
        </div>
       
    </div>
  )
}
