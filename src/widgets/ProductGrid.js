import React from 'react';

const ProductGrid = ({ products }) => (
  <div className="product-grid">
    {products.map((product, index) => (
      <div key={index} className="product-item">
        <h4>{product.name}</h4>
        <p>{product.description}</p>
      </div>
    ))}
  </div>
);

export default ProductGrid;
