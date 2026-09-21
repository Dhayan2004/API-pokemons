import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player } from '../types/player';
import { useToast } from './ToastContext';

const FAVORITES_STORAGE_KEY = '@futbolista_favoritos_v1';

interface FavoritesContextType {
  favorites: Player[];
  isFavorite: (idPlayer: string) => boolean;
  toggleFavorite: (player: Player) => Promise<boolean>;
  isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Player[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();

  // Keep a ref to the current favorites for atomic updates
  const favoritesRef = useRef<Player[]>([]);
  favoritesRef.current = favorites;

  // 1. Load persisted favorites on mount BEFORE allowing any write
  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      try {
        const storedJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedJson && isMounted) {
          const parsed: Player[] = JSON.parse(storedJson);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
            favoritesRef.current = parsed;
          }
        }
      } catch (err) {
        console.warn('[FavoritesContext] Error reading favorites from storage:', err);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const isFavorite = useCallback(
    (idPlayer: string): boolean => {
      return favorites.some((p) => p.idPlayer === idPlayer);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (player: Player): Promise<boolean> => {
      if (!isLoaded) {
        // Prevent toggling before storage is resolved
        return false;
      }

      const currentList = favoritesRef.current;
      const alreadyFav = currentList.some((p) => p.idPlayer === player.idPlayer);
      let updatedList: Player[];

      if (alreadyFav) {
        updatedList = currentList.filter((p) => p.idPlayer !== player.idPlayer);
      } else {
        // Store essential data to render card cleanly
        const minimalPlayer: Player = {
          idPlayer: player.idPlayer,
          strPlayer: player.strPlayer,
          strTeam: player.strTeam,
          strNationality: player.strNationality,
          strPosition: player.strPosition,
          positionInfo: player.positionInfo,
          imageUrl: player.imageUrl,
          thumbUrl: player.thumbUrl,
          strNumber: player.strNumber,
          dateBorn: player.dateBorn,
          age: player.age,
          heightCm: player.heightCm,
          formattedHeight: player.formattedHeight,
          weightKg: player.weightKg,
          formattedWeight: player.formattedWeight,
          description: player.description,
          isComplete: player.isComplete,
        };
        updatedList = [minimalPlayer, ...currentList];
      }

      try {
        await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedList));
        setFavorites(updatedList);
        favoritesRef.current = updatedList;

        if (alreadyFav) {
          showToast(`"${player.strPlayer}" eliminado de favoritos`, 'info');
          return false;
        } else {
          showToast(`"${player.strPlayer}" guardado en favoritos`, 'success');
          return true;
        }
      } catch (err) {
        console.error('[FavoritesContext] Error saving favorites:', err);
        showToast('No se pudo guardar el favorito en el dispositivo', 'error');
        return alreadyFav;
      }
    },
    [isLoaded, showToast]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        isLoaded,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
