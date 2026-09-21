import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { Player } from '../types/player';
import { ensureCompletePlayer } from '../services/footballApi';

interface ComparisonResult {
  success: boolean;
  message?: string;
}

interface ComparisonContextType {
  player1: Player | null;
  player2: Player | null;
  selectingSlot: 1 | 2 | null;
  startSelecting: (slot: 1 | 2) => void;
  cancelSelecting: () => void;
  selectPlayer: (player: Player, targetSlot?: 1 | 2) => Promise<ComparisonResult>;
  removePlayer: (slot: 1 | 2) => void;
  clearComparison: () => void;
  isPlayerSelected: (idPlayer: string) => boolean;
  whichSlot: (idPlayer: string) => 1 | 2 | null;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [selectingSlot, setSelectingSlot] = useState<1 | 2 | null>(null);

  const isPlayerSelected = useCallback(
    (idPlayer: string) => {
      return player1?.idPlayer === idPlayer || player2?.idPlayer === idPlayer;
    },
    [player1, player2]
  );

  const whichSlot = useCallback(
    (idPlayer: string): 1 | 2 | null => {
      if (player1?.idPlayer === idPlayer) return 1;
      if (player2?.idPlayer === idPlayer) return 2;
      return null;
    },
    [player1, player2]
  );

  const startSelecting = useCallback(
    (slot: 1 | 2) => {
      setSelectingSlot(slot);
      router.push('/(tabs)');
    },
    [router]
  );

  const cancelSelecting = useCallback(() => {
    setSelectingSlot(null);
  }, []);

  const removePlayer = useCallback((slot: 1 | 2) => {
    if (slot === 1) {
      setPlayer1(null);
    } else {
      setPlayer2(null);
    }
  }, []);

  const clearComparison = useCallback(() => {
    setPlayer1(null);
    setPlayer2(null);
    setSelectingSlot(null);
  }, []);

  const selectPlayer = useCallback(
    async (player: Player, explicitSlot?: 1 | 2): Promise<ComparisonResult> => {
      // Check for duplicates
      const currentSelectedSlot = whichSlot(player.idPlayer);
      const slotToUse = explicitSlot || selectingSlot;

      if (slotToUse) {
        // If assigning to slot 1 or 2
        const otherPlayer = slotToUse === 1 ? player2 : player1;
        if (otherPlayer && otherPlayer.idPlayer === player.idPlayer) {
          return {
            success: false,
            message: `"${player.strPlayer}" ya está en el Jugador ${slotToUse === 1 ? 2 : 1}. Elige a otro futbolista.`,
          };
        }

        // Enrich player with complete physical stats if from search summary
        const completePlayer = await ensureCompletePlayer(player);

        if (slotToUse === 1) {
          setPlayer1(completePlayer);
        } else {
          setPlayer2(completePlayer);
        }

        setSelectingSlot(null);
        router.push('/(tabs)/comparar');
        return { success: true };
      }

      // No explicit slot requested (e.g. clicked "Comparar" button on card)
      if (currentSelectedSlot !== null) {
        return {
          success: false,
          message: `"${player.strPlayer}" ya está en la comparación (Jugador ${currentSelectedSlot}).`,
        };
      }

      // Find first available slot
      if (!player1) {
        const completePlayer = await ensureCompletePlayer(player);
        setPlayer1(completePlayer);
        return { success: true, message: `"${player.strPlayer}" asignado al Jugador 1.` };
      }

      if (!player2) {
        const completePlayer = await ensureCompletePlayer(player);
        setPlayer2(completePlayer);
        return { success: true, message: `"${player.strPlayer}" asignado al Jugador 2.` };
      }

      // Both slots full: do not replace silently
      return {
        success: false,
        message: 'Ambos espacios están ocupados. Puedes cambiar o quitar uno desde la pestaña Comparar.',
      };
    },
    [whichSlot, selectingSlot, player1, player2, router]
  );

  return (
    <ComparisonContext.Provider
      value={{
        player1,
        player2,
        selectingSlot,
        startSelecting,
        cancelSelecting,
        selectPlayer,
        removePlayer,
        clearComparison,
        isPlayerSelected,
        whichSlot,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export function useComparison(): ComparisonContextType {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
