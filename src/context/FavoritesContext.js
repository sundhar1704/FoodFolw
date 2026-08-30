import React, { createContext, useContext, useState, useCallback } from 'react';

const FavoritesContext = createContext(null);

/**
 * Wrap the app in this (alongside CartProvider) so any screen can read/toggle
 * favorites. Favorite items look like: { id, name, price, image, description }
 */
export function FavoritesProvider({ children }) {
  const [items, setItems] = useState([]);

  const isFavorited = useCallback(
    (id) => items.some((i) => i.id === id),
    [items]
  );

  const addFavorite = useCallback((product) => {
    setItems((prev) =>
      prev.some((i) => i.id === product.id) ? prev : [...prev, product]
    );
  }, []);

  const removeFavorite = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleFavorite = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === product.id);
      if (exists) {
        return prev.filter((i) => i.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ items, isFavorited, addFavorite, removeFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used inside a <FavoritesProvider>');
  }
  return ctx;
}