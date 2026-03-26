import React, {useEffect, useState, useRef} from 'react';
import "./Common.css"
import { useCurrentCustomer } from "../data/CurrentCustomerProvider"
import { Image } from "react-bootstrap";


const DesignImage = (props) => {
  const imageRef = useRef(null);

  const [imageUrl, setImageUrl] = useState("")

  const currentCustomer = useCurrentCustomer();

  useEffect(() => {
    var imageUrlTemp = null
    if (props.designIndex && currentCustomer) {
      imageUrlTemp = currentCustomer.designs[props.designIndex].imageUrl
    }

    if (!imageUrlTemp) {
      setImageUrl("empty.png");
    } else {
      setImageUrl(imageUrlTemp);
    }

  }, [props, currentCustomer])

  //wait for data
  if (!currentCustomer ) return "Loading...";

  return (
    <div className="outsideWrapper">
      <div className="insideWrapper">
        <Image
          ref={imageRef}
          id="design-image"
          className='coveredImage'
          src={imageUrl}
        />
      </div>
    </div>
  )
}

export default DesignImage
  