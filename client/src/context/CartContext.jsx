import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'bela_bakers_cart_v1';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      // Ignore corrupt storage
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }, [items]);

  const addToCart = ({
    product,
    selectedVariant,
    quantity = 1,
    customDetails = null,
  }) => {
    if (!product || !selectedVariant) return;

    const customSignature = customDetails
      ? JSON.stringify(customDetails)
      : '';
    const cartItemId = `${product._id}::${selectedVariant.weight}::${customSignature}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + Number(quantity || 1),
          price: Number(selectedVariant.price),
        };
        return updated;
      }

      return [
        ...prev,
        {
          cartItemId,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          image: product.images?.[0]?.url || '',
          weight: selectedVariant.weight,
          price: Number(selectedVariant.price),
          pricingUnit: selectedVariant.pricingUnit || 'fixed',
          variants: product.variants || [],
          quantity: Math.max(1, Number(quantity || 1)),
          customDetails,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    const qty = Number(newQuantity);
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: qty } : item
      )
    );
  };

  const updateVariant = (cartItemId, newWeight) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId) return item;
        const foundVariant = (item.variants || []).find(
          (v) => v.weight === newWeight
        );
        if (!foundVariant) return item;
        const customSig = item.customDetails
          ? JSON.stringify(item.customDetails)
          : '';
        return {
          ...item,
          cartItemId: `${item.productId}::${foundVariant.weight}::${customSig}`,
          weight: foundVariant.weight,
          price: Number(foundVariant.price),
          pricingUnit: foundVariant.pricingUnit || 'fixed',
        };
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const estimatedTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateVariant,
        clearCart,
        estimatedTotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};
