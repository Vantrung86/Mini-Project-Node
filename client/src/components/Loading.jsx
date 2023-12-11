import React from 'react'
import "./Loading.css"

export default function Loading() {
  return (
    <div>     
        <div className="loader">
            <span className="loader-text">loading</span>
            <span className="load"></span>
        </div>
    </div>
  )
}
