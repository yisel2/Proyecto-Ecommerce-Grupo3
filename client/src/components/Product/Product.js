import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../Redux/actions/cartAction.js";

// CSS
import "./Product.css";
//COMPONENTES
import NavBar from "../NavBar/NavBar.js";
import ReviewList from './ReviewList.js';
import StarRating from "./StarRating.js";

export default function Product({ id }) {
  var [selectedColor, setSelectedColor] = useState("");

  const arrayProductos = useSelector((state) => state.products.products);
  const items = useSelector((state) => state.cart);

  const productDetail = arrayProductos.find(
    (product) => parseInt(product.id) == id
  );
  const dispatch = useDispatch();

  //RETORNA LA IMAGEN DE PORTADA DEL PRODUCTO
  function showImg(colors) {
    return colors.find((color) => color.stockXColor.main).stockXColor.image;
  }
  //RENDERIZA UN DIV (33x33) CON EL HEXACOLOR DE CADA OPCION QUE TIENE EL PRODUCTO
  function showColor(colors) {
    return colors.map((color) => (
      <div
        className="product_color_img"
        style={{ backgroundColor: color.hexaColor }}
        onClick={(e) => changeColor(colors,color.name)}
      ></div>
    ));
  }
  //GENERA EN EL SELECT UNA OPTION POR CADA COLOR DEL PRODUCTO
  function showColorOption(colors) {
    if (colors) {
      return colors.map((color) => (
        <option
          id={color.name}
          value={color.name}
          className="product_colors_option"
        >
          {color.name}
        </option>
      ));
    }
  }
  //MUESTRA COMO ACTIVO EN EL SELECT EL VALOR DEL COLOR SELECCIONADO
  function colorActive(colorName) {
  setSelectedColor(colorName);
  var option = document.querySelector("#" + colorName);
  option.selected = "selected";
  }
  //CAMBIA LA FOTO Y DEMAS DATOS DEL COLOR SEGUN CAMBIOS EN EL SELECT O EN LOS DIV (33x33)
  function changeColor(colors, colorName){
    if (colors && colorName){
      colorActive(colorName);
      let imageUrl = colors.find((color) => color.name === colorName).stockXColor.image;
      var img = document.querySelector("img"); 
      img.setAttribute("src", imageUrl);
    }
  }
  //COMPRUEBA SI EL PRODUCTO TIENE REVIEWS
  function haveReview(productDetail){
   // console.log(productDetail);
    if(productDetail.reviews){
      return  <ReviewList reviews={productDetail.reviews}/>;
    }
  }
  //RECOLECTA LOS DATOS DEL PRODUCTO Y DEL COLOR ELEGIDO PARA ENVIAR AL CARRITO
  function colorSelected(selectedColor, productDetail) {
    if (productDetail && selectedColor) {
      var idColor= productDetail.colors.find(color => color.name === selectedColor).id;
      var stockXColorId= productDetail.colors.find(color => color.name === selectedColor).stockXColor.id;
      console.log(stockXColorId);
      var product = {
        id: productDetail.id,
        name: productDetail.name,
        description: productDetail.description,
        price: productDetail.price,
        stockXColorId: stockXColorId,
        selectedColor: selectedColor,
        idColor: idColor,
      };
      dispatch(addToCart(product));
    } else {
      alert("Debe seleccionar un color");
    }
  }

  return (
    <div className="catalogo">
      <NavBar />
      <div className="catalogo_bg"></div>
      <div className="product_title">
        <h1>Detalle del producto</h1>
      </div>

      <div className="product_container">
        <div className="product_left">
          <div className="product_img">
            <img src={showImg(productDetail.colors)} alt="" />
          </div>
        </div>
        <div className="product_right">
          <div className="product_name">
            <h1>{productDetail.name}</h1>
          </div>
          <div className="product_descr">
            <p>{productDetail.description}</p>
          </div>
          <div className="product_price">
            <span>{"$ " + productDetail.price}</span>
          </div>
          <div className="product_colors">
            <span className="product_colors_name">Color: {selectedColor}</span>
            <div className="product_colors_img">
              {showColor(productDetail.colors)}
            </div>
            <div className="product_colors_list">
              <select onChange={(e) => changeColor(productDetail.colors, e.target.value) }>
                {showColorOption(productDetail.colors)}
              </select>
            </div>
          </div>
          <div className="product_cart_btn">
            <div onClick={(e) => colorSelected(selectedColor, productDetail, items)} >
              AGREGAR AL CARRITO
            </div>
          </div>
        </div>
      </div>
      <StarRating id={id}/>
      <div className="container_reviews_product">
          <h2>Reviews</h2>
      </div>
      {haveReview(productDetail)}
    </div>
  );
}
