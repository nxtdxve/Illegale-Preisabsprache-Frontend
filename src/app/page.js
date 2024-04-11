"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';


const prod = () => {
  const [products, setProducts] = useState([]);
  useEffect(() =>{
    fetch('https://baumarkt-backend-1e27ff4f12df.herokuapp.com/products')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setProducts(data);
    })
    .catch((err) => {
      console.log(err.message);
    });
  }, []);

  const [retailers, setRetailers] = useState([]);
  useEffect(() =>{
    fetch('https://baumarkt-backend-1e27ff4f12df.herokuapp.com/retailers')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setRetailers(data);
    })
    .catch((err) => {
      console.log(err.message);
    });
  }, []);

return (

  <div className="product-container">
    {products.map((product) => {
      return (
        <div>
          <p className="product-name">{product.name}</p>
          {retailers.map((retailer) => {
          <p className="product-price-hornbach">{retailer.name}: CHF {product.price_details.price_records.price}</p>
          })}
        </div>
      );

    })}
  </div>
)

};

export default prod;