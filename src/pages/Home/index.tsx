import React, { useState, useEffect } from 'react';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { ProductCard } from '../../components/Product';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((productsAmount, product) => {
    productsAmount[product.id] = productsAmount[product.id] ?? 0 + product.amount;
    return productsAmount;
  }, {} as CartItemsAmount);
  
  useEffect(() => {
    async function loadProducts() {
      const productsRaw = (await api.get('products')).data as Product[];
      setProducts(productsRaw.map((product) => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      })));
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map(product =>
        <ProductCard
          key={product.id}
          handleAddProduct={() => handleAddProduct(product.id)}
          amount={cartItemsAmount[product.id] || 0}
          {...product}
        />
      )}
    </ProductList>
  );
};

export default Home;
