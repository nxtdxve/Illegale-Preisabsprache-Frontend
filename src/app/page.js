"use client";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';


const App = () => {
  const [products, setProducts] = useState([]);
  useEffect(() =>{
    fetch('https://baumarkt-backend-1e27ff4f12df.herokuapp.com/products', { cache: 'force-cache'})
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
    fetch('https://baumarkt-backend-1e27ff4f12df.herokuapp.com/retailers', { cache: 'force-cache'})
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
  <div className={styles.product_container}>
    <h1 className={styles.title}>illegale Preisabsprache</h1>
    {products.map((product) => {
      return (
        <div className={styles.product_name}>
          <p>{product.name}</p>
          {retailers.map((retailer) => {
            var current_price
            product.price_details.price_records.map( (retailer_price)  => {
              if (retailer_price.retailer_id == retailer._id.$oid) {
                current_price = retailer_price.price
              }
            })
            return (
            <p className={styles.product_price}>{retailer.name}: CHF {current_price}</p>
    )})}    
          <Link href={`./product_detail/${product._id}`} replace>Info</Link>
        </div>
      );
    })}
  </div>
)

};

export default App;
