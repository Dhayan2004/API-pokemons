import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../context/ToastContext';
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from '../constants/theme';

export const AppToast: React.FC = () => {
  const { toast, hideToast } = useToast();
  const insets = useSafeAreaInsets();

  if (!toast) return null;

  const getTheme = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: '#F0FDF4',
          border: '#86EFAC',
          text: '#14532D',
          icon: 'checkmark-circle' as const,
          iconColor: '#16A34A',
        };
      case 'warning':
        return {
          bg: '#FEFCE8',
          border: '#FDE047',
          text: '#713F12',
          icon: 'alert-circle' as const,
          iconColor: '#CA8A04',
        };
      case 'error':
        return {
          bg: '#FEF2F2',
          border: '#FCA5A5',
          text: '#7F1D1D',
          icon: 'close-circle' as const,
          iconColor: '#DC2626',
        };
      case 'info':
      default:
        return {
          bg: COLORS.white,
          border: COLORS.borderColor,
          text: COLORS.textPrimary,
          icon: 'information-circle' as const,
          iconColor: COLORS.primary,
        };
    }
  };

  const theme = getTheme();
  // Keep above the bottom tab bar (tab bar height ~72 + safe area)
  const bottomOffset = Math.max(insets.bottom + 76, 84);

  return (
    <View
      style={[
        styles.toastWrapper,
        { bottom: bottomOffset },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.bg,
            borderColor: theme.border,
          },
        ]}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <Ionicons name={theme.icon} size={20} color={theme.iconColor} style={styles.icon} />
        <Text style={[styles.messageText, { color: theme.text }]} numberOfLines={3}>
          {toast.message}
        </Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={hideToast}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Cerrar notificación"
        >
          <Ionicons name="close" size={18} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    ...SHADOWS.card,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(23, 77, 56, 0.16)',
      },
    }),
  },
  icon: {
    marginRight: 10,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  closeBtn: {
    marginLeft: 8,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
