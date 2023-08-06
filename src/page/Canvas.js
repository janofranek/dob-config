import React, { useRef, useEffect } from 'react'

const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    //Our first draw
    context.strokeStyle = '#FF0000'
    context.strokeRect(10, 10, 10, 10)
    context.strokeRect(80, 80, 10, 10)
  }, [])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas