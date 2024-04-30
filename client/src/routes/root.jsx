import React from 'react'
import { Outlet } from 'react-router-dom'

const Root = () => {
  return (
    <>
      <div>Navbar</div>
      <Outlet />
    </>
  )
}

export default Root