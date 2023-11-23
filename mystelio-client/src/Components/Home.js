import React from 'react'
import { useAuth } from '../AuthContext'

export default function Home() {
  const auth = useAuth();
  return (
    <>

    {auth.user && <p>{auth.user.token}
      </p>}
     <h1>Mystelio - Connect in Style</h1> 

    </>
  )
}
