import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Home from './component/Home'
import { Routes, Route } from "react-router-dom";


import Register from './pages/Register'

import Homenav from './layout/Homenav'
import Homenavvv from './layout/Homenavvv'
import Account from './pages/Account'
import Navvacc from './layout/Navvacc'
import Postjob from './pages/Postjobe'
import Search from './pages/Search'
import Managejob from './pages/Managejob'
import Apply from './pages/Apply'

import Seekerlogin from './pages/Seekerlogin'
import Seekernav from './layout/Seekernav'
import Homeseeker from './pages/Homeseeker'
import Editprofile from './pages/Editprofile'

import Experience from './pages/Experience'
import Canditatelist from './pages/Canditatelist'
import Applyjob from './pages/Applyjob'
import Applicationpage from './pages/Applicationpage'
import View from './pages/View'
import Appplication from './pages/Appplication'
import Category from './pages/Categories'

import RecenthotsJob from './pages/Recenthotsjob'
import Managejobb from './pages/Managejobb'
import Adminnav from './layout/Adminnav'
import Addcategory from './pages/Addcategory'
import EmployerList from './pages/Employerlist'
import Jobseeker from './pages/Jobseekar'
import Fulldetails from './pages/Fulldetails'

import ContactUs from './pages/ContactUs'

import Categoryjob from './pages/Categoryjob'
import Searchbar from './pages/Searchbar'
import Dash from './pages/Dash'

import Admin from './pages/Admin'
import ProtectedRoute from "./component/ProtectedRoute";
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'
import ResetPassword from './pages/ResetPassword'
import Managecategory from './pages/Managecategory'
import AdminProfile from './pages/AdminProfile'
import Dateseekerlist from './pages/Dateseekerlist'
import Login from './pages/Login'



// or the correct path where your ProtectedRoute component exists



function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
     <Routes>
         <Route path='/admin'element={<Admin></Admin>}></Route>
      
         <Route path='/'element={<Homenav></Homenav>}>
           <Route path='/'element={<Category></Category>}></Route>
             {/* <Route path='/contactt'element={<ContactPage></ContactPage>}></Route> */}
             <Route path='/'element={<RecenthotsJob></RecenthotsJob>}></Route>
             <Route path='/login'element={<Login></Login>}></Route>
             <Route path='/register'element={<Register></Register>}></Route>
                <Route
  path="/categoryjob/:category"
  element={<Categoryjob />}></Route>
                  
         
      
         
         
          </Route>
           <Route path='/'element={<Homenav></Homenav>}>
                <Route path='/apply/:id'element={<Apply></Apply>}></Route>
         
         
          </Route>
           <Route path='/'element={<Homenavvv></Homenavvv>}>
           
                 {/* <Route path='/seeker'element={<Seeker></Seeker>}></Route> */}
                   <Route path='/seekerlogin'element={<Seekerlogin></Seekerlogin>}></Route>
                    <Route path="/forgotpassword" element={<ForgotPassword></ForgotPassword>} />
        <Route path="/verifyotp" element={<VerifyOtp></VerifyOtp>} />
        <Route path="/resetpassword" element={<ResetPassword></ResetPassword>} />
                   
                      
         
         
         
          </Route>
          
          
           
          
            



             <Route path='/'element={<Navvacc></Navvacc>}>
              <Route path='/search'element={<Search></Search>}></Route>
               <Route path='/account'element={<Account></Account>}></Route>
                <Route path='/postjob'element={<Postjob></Postjob>}></Route>
                 <Route path='/manage'element={<Managejob></Managejob>}></Route>
              
              <Route path='/list'element={<Canditatelist></Canditatelist>}></Route>
              <Route path='/applicationdetails/:id'element={<Applicationpage></Applicationpage>}></Route>
              <Route path='/view/:id'element={<View></View>}></Route>
              <Route path='/managejob'element={<Managejobb></Managejobb>}></Route>

             
             
             
             </Route>
 <Route path='/'element={<Seekernav></Seekernav>}>
  <Route path='/home'element={<Homeseeker></Homeseeker>}></Route>
   <Route path='/editprofile'element={<Editprofile></Editprofile>}></Route>
    {/* <Route path='/education'element={<Education></Education>}></Route> */}
     <Route path='/experience'element={<Experience></Experience>}></Route>
     <Route path='/applyjob'element={<Applyjob></Applyjob>}></Route>
      <Route path='/application/:id'element={<Appplication></Appplication>}></Route>
       <Route path='/hhome'element={<Home></Home>}></Route>
        <Route path='/bar'element={<Searchbar></Searchbar>}></Route>
       
        
      
      
 
 
 
 
 
 
 
 </Route>
  
  <Route element={<ProtectedRoute role="admin" />}>
    <Route path='/'element={<Adminnav></Adminnav>}> 
    <Route path='/adminprofile'element={<AdminProfile></AdminProfile>}></Route>
   <Route path='/addcategory'element={<Addcategory></Addcategory>}></Route>
    <Route path='/employerlist'element={<EmployerList></EmployerList>}></Route>
    <Route path='/jobseekerlist'element={<Jobseeker></Jobseeker>}></Route>
    <Route path='/fulldetails/:id'element={<Fulldetails></Fulldetails>}></Route>
    <Route path='/contact'element={<ContactUs></ContactUs>}></Route>
    <Route path='/dash'element={<Dash></Dash>}></Route>
    <Route path='/managecategory'element={<Managecategory></Managecategory>}></Route>
   
    <Route path='/date'element={<Dateseekerlist></Dateseekerlist>}></Route>
    </Route> 
    </Route>

             
    

         
    </Routes>
    </div>
     
  )
}

export default App
