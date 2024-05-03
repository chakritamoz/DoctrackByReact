import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const Root = () => {
  return (
    <>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/accounts">Account</Link></li>
        <li><Link to='/signin'>Sign In</Link></li>
      </ul>
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default Root