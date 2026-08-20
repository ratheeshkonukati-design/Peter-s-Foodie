import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

interface FavoritesContextType {
  favoriteRestaurants: string[];
  favoriteFoods: string[];
  isRestaurantFavorite: (id: string) => boolean;
  isFoodFavorite: (id: string) => boolean;
  toggleRestaurantFavorite: (id: string) => void;
  toggleFoodFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>([]);

  useEffect(() => {
    const favs = StorageService.getFavorites();
    setFavoriteRestaurants(favs.restaurants || []);
    setFavoriteFoods(favs.foods || []);
  }, []);

  const isRestaurantFavorite = (id: string) => favoriteRestaurants.includes(id);
  const isFoodFavorite = (id: string) => favoriteFoods.includes(id);

  const toggleRestaurantFavorite = (id: string) => {
    const updated = StorageService.toggleFavoriteRestaurant(id);
    setFavoriteRestaurants([...updated]);
  };

  const toggleFoodFavorite = (id: string) => {
    const updated = StorageService.toggleFavoriteFood(id);
    setFavoriteFoods([...updated]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRestaurants,
        favoriteFoods,
        isRestaurantFavorite,
        isFoodFavorite,
        toggleRestaurantFavorite,
        toggleFoodFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};
