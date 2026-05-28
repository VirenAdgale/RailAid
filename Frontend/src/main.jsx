import { StrictMode } from 'react'
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Support from './pages/Support.jsx'
import Booking from './pages/Booking.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import StaffLogin from './pages/StaffLogin.jsx'
import StaffDashboard from './pages/StaffDashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { TextSizeProvider } from './context/TextSizeContext.jsx'
import { AccessibilityProvider } from './context/AccessibilityContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children:[
      {
        path: '/',
        element: <Home/>
      },
      
      {
        path: '/admin-login',
        element: <AdminLogin/>
      },
      {
        path: 'staff-login',
        element: <StaffLogin/>
      },
      {
        path: '/services',
        element: <Services/>
      },

      {
        path: '/about',
        element: <About/>
      },
      {
        path: '/support',
        element: <Support/>
      },
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/register',
        element: <Register/>
      },
      {
        path:"/booking",
        element: <Booking/>
      },
      {
        element: <ProtectedRoute allowedRoles={["staff"]} />,
        children: [
          {
            path: "/staff-dashboard",
            element: <StaffDashboard />
          }
        ]
       }
      

    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccessibilityProvider>
      <TextSizeProvider>
        <RouterProvider router={router}/>
      </TextSizeProvider>
    </AccessibilityProvider>
  </StrictMode>,
)
