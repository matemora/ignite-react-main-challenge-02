import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const productStock = (await api.get(`/stock/${productId}`)).data as Stock;
      if (!productStock) {
        toast.error('Erro na adição do produto');
        return;
      }
      const updatedCart = [...cart];
      const productOnCart = updatedCart.find(product => productId === product.id);
      if (productOnCart) {
        if (productOnCart.amount + 1 <= productStock.amount) {
          productOnCart.amount += 1;
        } else {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }
      } else {
        const product = (await api.get(`/products/${productId}`)).data as Product;
        updatedCart.push({ ...product, amount: 1 });
      }
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      if (!cart.find(product => product.id === productId)) {
        toast.error('Erro na remoção do produto');
        return;
      }
      const updatedCart = [...cart].filter(product => product.id !== productId);
      setCart(updatedCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount < 1) {
        toast.error('Erro na adição do produto');
        return;
      }
      const productStock = (await api.get(`/stock/${productId}`)).data as Stock;
      if (!productStock) {
        toast.error('Erro na adição do produto');
        return;
      }
      const updatedCart = [...cart];
      const productOnCart = updatedCart.find(product => productId === product.id);
      if (productOnCart) {
        if (amount <= productStock.amount) {
          productOnCart.amount = amount;
        } else {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }
      }
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
