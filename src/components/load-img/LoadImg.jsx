import './LoadImg.scss'
import React from 'react'

const LoadImg = ({ url }) => {
    return url ? url : <div className="load-img"/>
}

export default LoadImg
