import React, {useEffect, useState, useRef} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Image } from "react-bootstrap";
import Canvas from './Canvas';


const TemplateImage = (props) => {
  const imageRef = useRef(null);
  const imageObj = imageRef.current;

  const [imageUrl, setImageUrl] = useState("")
  const [imgPosition, setImagePosition] = useState({}) 
  const [rectPosition, setRectPosition] = useState({}) 

  const currentCustomer = useCurrentCustomer();

  useEffect(() => {
    var imageUrlTemp = null
    if (props.templateIndex && currentCustomer) {
      imageUrlTemp = currentCustomer.templates[props.templateIndex].imageUrl
    }

    if (!imageUrlTemp) {
      setImageUrl("empty.png");
    } else {
      setImageUrl(imageUrlTemp);
    }

    if (!props.showPositionRect) {
      setRectPosition({ left: 100, top: 100, width: 100, height: 100 });
    } else {
      setRectPosition(props.showPositionRect);
    }

  }, [props, currentCustomer])

  //wait for data
  if (!currentCustomer ) return "Loading...";

  const getImagePosition = (img) => {
    const newPosition = {};
    newPosition["naturalWidth"] = img.naturalWidth;
    newPosition["naturalHeight"] = img.naturalHeight;
    newPosition["offsetTop"] = img.offsetTop;
    newPosition["offsetLeft"] = img.offsetLeft;
    //object-fit creates letterbox - so the dimensions of the image are the same as the container
    newPosition["width"] = img.width;
    newPosition["height"] = img.height;

    //"real" dimensions of the image have to be calculated
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    if (img.width / aspectRatio > img.height) {
      newPosition["realWidth"] = Math.round(img.height * aspectRatio);
      newPosition["realHeight"] = img.height;
      newPosition["realOffsetTop"] = img.offsetTop;
      newPosition["realOffsetLeft"] = img.offsetLeft + Math.round(( img.width - newPosition["realWidth"]) / 2);
      } else {
      newPosition["realWidth"] = img.width;
      newPosition["realHeight"] = Math.round(img.width / aspectRatio);
      newPosition["realOffsetTop"] = img.offsetTop  + Math.round(( img.height - newPosition["realHeight"]) / 2);
      newPosition["realOffsetLeft"] = img.offsetLeft;
    }
    return newPosition
  }

  const onLoad = () => {
    const newPosition = getImagePosition(imageObj);
    setImagePosition(newPosition);
    props.setImageProps(newPosition)
    setRectPosition(props.positionRect);
  };

  return (
    <div className="outsideWrapper">
      <div className="insideWrapper">
        <Image
          ref={imageRef}
          id="product-image"
          className='coveredImage'
          onLoad={onLoad}
          src={imageUrl}
        />
        <Canvas id="testCanvas" imgPosition={imgPosition} rectPosition={rectPosition} mode="show"/>
      </div>
    </div>
  )
}

export default TemplateImage
  