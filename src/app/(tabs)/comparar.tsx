import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBanner } from '../../components/HeaderBanner';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function CompararScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBanner subtitle="Comparador de futbolistas" />
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="swap-horizontal-outline" size={40} color={COLORS.primary} />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ETAPA 3 - VALOR AGREGADO</Text>
          </View>
          <Text style={styles.title}>Comparador Objetivo</Text>
          <Text style={styles.description}>
            En la tercera etapa podrás comparar dos futbolistas frente a frente, calculando automáticamente sus diferencias de edad, estatura y peso.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  badge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
});
