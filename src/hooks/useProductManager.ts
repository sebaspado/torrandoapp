import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Product } from '@/types/product';

export const useProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { data: session } = useSession();

  // Load products from localStorage on mount
  useEffect(() => {
    if (session?.user?.email) {
      try {
        const storedProducts = localStorage.getItem(`products_${session.user.email}`);
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    }
  }, [session]);

  const addProduct = (product: Product) => {
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts, product];
      try {
        if (session?.user?.email) {
          localStorage.setItem(`products_${session.user.email}`, JSON.stringify(updatedProducts));
        }
      } catch (error) {
        console.error('Failed to save products:', error);
      }
      return updatedProducts;
    });
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product =>
        product.id === productId
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      );
      try {
        if (session?.user?.email) {
          localStorage.setItem(`products_${session.user.email}`, JSON.stringify(updatedProducts));
        }
      } catch (error) {
        console.error('Failed to save products:', error);
      }
      return updatedProducts;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.filter(product => product.id !== productId);
      try {
        if (session?.user?.email) {
          localStorage.setItem(`products_${session.user.email}`, JSON.stringify(updatedProducts));
        }
      } catch (error) {
        console.error('Failed to save products:', error);
      }
      return updatedProducts;
    });
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
}; 