import React, {useEffect} from 'react';
import "./Common.css"
import { Image } from "react-bootstrap";
import { run as runHolder } from 'holderjs/holder';


const ProductImage = (props) => {

  useEffect(() => {        
    runHolder('image-class-name');
  });
      
  const onLoad = () => {
    console.log("loaded");
    const img = document.getElementById("product-image")
    console.log(img.naturalWidth)
    console.log(img.naturalHeight)
  };

  return (
    <Image
      id="product-image"
      className='coveredImage'
      onLoad={onLoad}
      src={props.imgUrl ?? "holder.js/450x350?text=Obrázek"}
    />

  )
}

export default ProductImage