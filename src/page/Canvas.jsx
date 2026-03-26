import React, { useRef, useEffect, useState, useCallback } from 'react'

const Canvas = (props) => {
  
  const canvasRef = useRef(null)
  const canvas = canvasRef.current
  const handleRadius = 4
  const [style, setStyle] = useState({
    position: "absolute",
    border: "1px solid red",
    zIndex: "3",
    backgroundColor:"transparent"
  });
  const [mode, setMode] = useState("show")
  const [rectReal, setRectReal] = useState({})
  const [rectNatural, setRectNatural] = useState({})
  const [dragTL, setDragTL] = useState(false)
  const [dragBL, setDragBL] = useState(false)
  const [dragTR, setDragTR] = useState(false)
  const [dragBR, setDragBR] = useState(false)
  const [dragWR, setDragWR] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  
  const drawRectInCanvas = useCallback(() => {

    const drawCircle = (x, y, radius) => {
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#c757e7";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    const drawHandles = () => {
      drawCircle(rectReal.left, rectReal.top, handleRadius);
      drawCircle(rectReal.left + rectReal.width, rectReal.top, handleRadius);
      drawCircle(rectReal.left + rectReal.width, rectReal.top + rectReal.height, handleRadius);
      drawCircle(rectReal.left, rectReal.top + rectReal.height, handleRadius);
    }
      
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.fillStyle = "rgba(199, 87, 231, 0.2)";
    ctx.strokeStyle = "#c757e7";
    ctx.rect(rectReal.left, rectReal.top, rectReal.width, rectReal.height);
    ctx.fill();
    ctx.stroke();
    if (mode === "edit") {
      drawHandles();
    }
    // updateHiddenInputs()
  }, [canvas, mode, rectReal])

  useEffect(() => {

    // const canvas = canvasRef.current

    if ("width" in props.imgPosition) {
      canvas.height = props.imgPosition.realHeight
      canvas.width = props.imgPosition.realWidth
      setStyle(style => ({
        ...style, 
        "top": props.imgPosition.realOffsetTop + "px",
        "left": props.imgPosition.realOffsetLeft + "px"
      }));
    }

    if (props.rectPosition && "width" in props.rectPosition && "width" in props.imgPosition) {
      const ratio_w = props.imgPosition.realWidth / props.imgPosition.naturalWidth;
      const ratio_h = props.imgPosition.realHeight / props.imgPosition.naturalHeight;
      const rectPositionNatural = {
        left: props.rectPosition.left,
        top: props.rectPosition.top,
        width: props.rectPosition.width,
        height: props.rectPosition.height
      }
      const rectPositionReal = {
        left: Math.round(props.rectPosition.left * ratio_w),
        top: Math.round(props.rectPosition.top * ratio_h),
        width: Math.round(props.rectPosition.width * ratio_w),
        height: Math.round(props.rectPosition.height * ratio_w)
      };
      setRectNatural(rectPositionNatural);
      setRectReal(rectPositionReal);
      setMode(props.mode)
    }

  }, [props, canvas])

  useEffect(() => {
    if ("left" in rectReal) {
      drawRectInCanvas()
    }
  
  }, [rectReal, drawRectInCanvas])

  const recalculateNativeRect = () => {
    const ratio_w =  props.imgPosition.naturalWidth / props.imgPosition.realWidth;
    const ratio_h = props.imgPosition.naturalHeight / props.imgPosition.realHeight;
    const rectPositionNatural = {
      left: Math.round(rectReal.left * ratio_w),
      top: Math.round(rectReal.top * ratio_h),
      width: Math.round(rectReal.width * ratio_w),
      height: Math.round(rectReal.height * ratio_h)
    }
    setRectNatural(rectPositionNatural);
  }

  const onMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === "show") return;

    if (dragTL || dragTR || dragBL || dragBR || dragWR) {
      recalculateNativeRect();
    }
    setDragTL(false)
    setDragBL(false)
    setDragTR(false)
    setDragBR(false)
    setDragWR(false)
  }
  
  //mousedown connected functions -- START
  const checkInRect = (x, y, r) => {
    return (x>r.left && x<(r.width+r.left)) && (y>r.top && y<(r.top+r.height));
  }
  
  const checkCloseEnough = (p1, p2) => {
    return Math.abs(p1 - p2) < handleRadius;
  }
  
  const getMousePos = (evt) => {
    var clx, cly
    if (evt.type === "touchstart" || evt.type === "touchmove") {
      clx = evt.touches[0].clientX;
      cly = evt.touches[0].clientY;
    } else {
      clx = evt.clientX;
      cly = evt.clientY;
    }
    var boundingRect = canvas.getBoundingClientRect();
    return {
      x: clx - boundingRect.left,
      y: cly - boundingRect.top
    };
  }
  
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === "show") return;

    var pos = getMousePos(e);
    var mouseX = pos.x
    var mouseY = pos.y

    // 0. inside movable rectangle
    if (checkInRect(mouseX, mouseY, rectReal)){
      setDragWR(true);
      setStartX(mouseX);
      setStartY(mouseY);
    }
    // 1. top left
    else if (checkCloseEnough(mouseX, rectReal.left) && checkCloseEnough(mouseY, rectReal.top)) {
        setDragTL(true);
        console.log("DragTL")
      }
    // 2. top right
    else if (checkCloseEnough(mouseX, rectReal.left + rectReal.width) && checkCloseEnough(mouseY, rectReal.top)) {
        setDragTR(true);
    }
    // 3. bottom left
    else if (checkCloseEnough(mouseX, rectReal.left) && checkCloseEnough(mouseY, rectReal.top + rectReal.height)) {
        setDragBL(true);
    }
    // 4. bottom right
    else if (checkCloseEnough(mouseX, rectReal.left + rectReal.width) && checkCloseEnough(mouseY, rectReal.top + rectReal.height)) {
        setDragBR(true);
    }
    // drawRectInCanvas();
  }
  //mousedown connected functions -- END
  
  const onMouseMove = (e) => {    
    e.preventDefault();
    e.stopPropagation();
    if (mode === "show") return;

    var pos = getMousePos(e);
    var mouseX = pos.x
    var mouseY = pos.y
    var dx, dy

    if (dragWR) {
      dx = mouseX - startX;
      dy = mouseY - startY;
      if ((rectReal.left+dx)>0 && (rectReal.left+dx+rectReal.width)<canvas.width){
        setRectReal({...rectReal, left: rectReal.left += dx});
      }
      if ((rectReal.top+dy)>0 && (rectReal.top+dy+rectReal.height)<canvas.height){
        setRectReal({...rectReal, top: rectReal.top += dy});
      }
      setStartX(mouseX);
      setStartY(mouseY);
    } else if (dragTL) {
      dx = rectReal.left - mouseX
      dy = rectReal.top - mouseY

      if ((rectReal.width + dx)>0 && (rectReal.height + dy)>0) {
        setRectReal({
          left: rectReal.left - dx,
          top: rectReal.top - dy,
          width: rectReal.width + dx,
          height: rectReal.height + dy
        })
      }
    } else if (dragTR) {
      dx = rectReal.left + rectReal.width - mouseX
      dy = rectReal.top - mouseY
      if ((rectReal.width - dx)>0 && (rectReal.height + dy)>0) {
        setRectReal({...rectReal, 
          top: rectReal.top - dy,
          width: rectReal.width - dx,
          height: rectReal.height + dy
        })
      }
    } else if (dragBL) {
      dx = rectReal.left - mouseX
      dy = rectReal.top + rectReal.height - mouseY
      if ((rectReal.width + dx)>0 && (rectReal.height - dy)>0) {
        setRectReal({...rectReal, 
          left: rectReal.left - dx,
          width: rectReal.width + dx,
          height: rectReal.height - dy
        })
      }
    } else if (dragBR) {
      dx = rectReal.left + rectReal.width - mouseX
      dy = rectReal.top + rectReal.height - mouseY
      if ((rectReal.width - dx)>0 && (rectReal.height - dy)>0) {
        setRectReal({...rectReal, 
          width: rectReal.width - dx,
          height: rectReal.height - dy
        })
      }
    }
    drawRectInCanvas();
  }
  
  return (
    <canvas 
      ref={canvasRef}
      id={props.id}
      style={style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      // onTouchStart={onMouseDown}
      // onTouchEnd={onMouseUp}
      // onTouchMove={onMouseMove}
    >
    </canvas>
  )
}

export default Canvas