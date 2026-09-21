import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export interface FilterState {
  category: string;
  team: string;
  ageRange: string;
}

export const INITIAL_FILTERS: FilterState = {
  category: 'Todas',
  team: 'Todos',
  ageRange: 'Todas',
};

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableTeams?: string[];
  totalResults?: number;
}

const POSITION_CATEGORIES = [
  { id: 'Todas', label: 'Todas las Posiciones', icon: 'apps-outline' },
  { id: 'Delantero', label: 'Delanteros', icon: 'football-outline' },
  { id: 'Centrocampista', label: 'Medios', icon: 'shuffle-outline' },
  { id: 'Defensa', label: 'Defensas', icon: 'shield-outline' },
  { id: 'Portero', label: 'Porteros', icon: 'hand-left-outline' },
];

const AGE_RANGES = [
  { id: 'Todas', label: 'Todas las edades' },
  { id: '<25', label: '< 25 años (Jóvenes)' },
  { id: '25-30', label: '25 a 30 años (Plenitud)' },
  { id: '>30', label: '> 30 años (Veteranos)' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  availableTeams = [],
  totalResults,
}) => {
  const [modalType, setModalType] = useState<'team' | 'age' | null>(null);

  const activeFiltersCount =
    (filters.category !== 'Todas' ? 1 : 0) +
    (filters.team !== 'Todos' ? 1 : 0) +
    (filters.ageRange !== 'Todas' ? 1 : 0);

  const handleCategorySelect = (categoryId: string) => {
    onFilterChange({
      ...filters,
      category: categoryId,
    });
  };

  const handleTeamSelect = (team: string) => {
    onFilterChange({
      ...filters,
      team,
    });
    setModalType(null);
  };

  const handleAgeSelect = (ageRange: string) => {
    onFilterChange({
      ...filters,
      ageRange,
    });
    setModalType(null);
  };

  const handleResetFilters = () => {
    onFilterChange(INITIAL_FILTERS);
  };

  // Combine provided teams with common top teams, deduplicated
  const teamList = Array.from(
    new Set(['Todos', ...availableTeams.filter(Boolean)])
  );

  return (
    <View style={styles.wrapper}>
      {/* Horizontal Position Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalChips}
      >
        {POSITION_CATEGORIES.map((cat) => {
          const isSelected = filters.category === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
              ]}
              onPress={() => handleCategorySelect(cat.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={cat.icon as any}
                size={14}
                color={isSelected ? COLORS.white : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.categoryChipTextSelected,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sub-Filters: Team & Age Selector Badges */}
      <View style={styles.subFilterRow}>
        <View style={styles.selectorsGroup}>
          {/* Team Filter Button */}
          <TouchableOpacity
            style={[
              styles.subFilterButton,
              filters.team !== 'Todos' && styles.subFilterButtonActive,
            ]}
            onPress={() => setModalType('team')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="shield-half-outline"
              size={13}
              color={filters.team !== 'Todos' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.subFilterButtonText,
                filters.team !== 'Todos' && styles.subFilterButtonTextActive,
              ]}
              numberOfLines={1}
            >
              {filters.team === 'Todos' ? 'Equipo: Todos' : filters.team}
            </Text>
            <Ionicons
              name="chevron-down"
              size={12}
              color={filters.team !== 'Todos' ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>

          {/* Age Filter Button */}
          <TouchableOpacity
            style={[
              styles.subFilterButton,
              filters.ageRange !== 'Todas' && styles.subFilterButtonActive,
            ]}
            onPress={() => setModalType('age')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar-outline"
              size={13}
              color={filters.ageRange !== 'Todas' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.subFilterButtonText,
                filters.ageRange !== 'Todas' && styles.subFilterButtonTextActive,
              ]}
            >
              {filters.ageRange === 'Todas'
                ? 'Edad: Todas'
                : filters.ageRange === '<25'
                ? '< 25 años'
                : filters.ageRange === '25-30'
                ? '25-30 años'
                : '> 30 años'}
            </Text>
            <Ionicons
              name="chevron-down"
              size={12}
              color={filters.ageRange !== 'Todas' ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Reset / Count Indicator */}
        {activeFiltersCount > 0 ? (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetFilters}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={14} color={COLORS.errorText} />
            <Text style={styles.resetButtonText}>Limpiar ({activeFiltersCount})</Text>
          </TouchableOpacity>
        ) : typeof totalResults === 'number' ? (
          <Text style={styles.resultCountText}>{totalResults} futbolistas</Text>
        ) : null}
      </View>

      {/* Modal for Team Selection */}
      <Modal
        visible={modalType === 'team'}
        transparent
        animationType="fade"
        onRequestClose={() => setModalType(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalType(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por Equipo</Text>
              <TouchableOpacity
                onPress={() => setModalType(null)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {teamList.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.modalOption,
                    filters.team === t && styles.modalOptionSelected,
                  ]}
                  onPress={() => handleTeamSelect(t)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      filters.team === t && styles.modalOptionTextSelected,
                    ]}
                  >
                    {t}
                  </Text>
                  {filters.team === t && (
                    <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal for Age Selection */}
      <Modal
        visible={modalType === 'age'}
        transparent
        animationType="fade"
        onRequestClose={() => setModalType(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalType(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por Rango de Edad</Text>
              <TouchableOpacity
                onPress={() => setModalType(null)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalList}>
              {AGE_RANGES.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.modalOption,
                    filters.ageRange === r.id && styles.modalOptionSelected,
                  ]}
                  onPress={() => handleAgeSelect(r.id)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      filters.ageRange === r.id && styles.modalOptionTextSelected,
                    ]}
                  >
                    {r.label}
                  </Text>
                  {filters.ageRange === r.id && (
                    <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    paddingVertical: SPACING.sm,
  },
  horizontalChips: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs + 2,
    alignItems: 'center',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  categoryChipTextSelected: {
    color: COLORS.white,
  },
  subFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    gap: SPACING.xs,
  },
  selectorsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flex: 1,
  },
  subFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    maxWidth: 160,
  },
  subFilterButtonActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.primary,
  },
  subFilterButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  subFilterButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.errorBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  resetButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.errorText,
  },
  resultCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    width: '100%',
    maxHeight: '60%',
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    paddingBottom: SPACING.sm,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalList: {
    maxHeight: 280,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  modalOptionSelected: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
  },
  modalOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
