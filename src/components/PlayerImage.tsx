import React, { useState } from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { FallbackImage } from './FallbackImage';
import { COLORS } from '../constants/theme';

interface PlayerImageProps {
  cutoutUrl?: string | null;
  thumbUrl?: string | null;
  name: string;
  number?: string | null;
  height?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export const PlayerImage: React.FC<PlayerImageProps> = ({
  cutoutUrl,
  thumbUrl,
  name,
  number,
  height = 148,
  containerStyle,
}) => {
  // Determine available URLs in priority order: Cutout (transparent PNG) > Thumb (photo)
  const candidateUrls: string[] = [];
  if (cutoutUrl && cutoutUrl.trim().startsWith('http')) {
    candidateUrls.push(cutoutUrl.trim());
  }
  if (thumbUrl && thumbUrl.trim().startsWith('http') && thumbUrl.trim() !== cutoutUrl?.trim()) {
    candidateUrls.push(thumbUrl.trim());
  }

  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

  const handleImageError = () => {
    setCurrentUrlIndex((prev) => prev + 1);
  };

  const activeUri = candidateUrls[currentUrlIndex];

  if (!activeUri) {
    return <FallbackImage name={name} number={number} height={height} />;
  }

  return (
    <View style={[styles.container, { height }, containerStyle]}>
      <Image
        source={{ uri: activeUri }}
        style={styles.image}
        resizeMode="contain"
        onError={handleImageError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10, // 8-12pt reference to guarantee head is fully visible without clipping
    paddingBottom: 4,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  image: {
    width: '92%',
    height: '92%',
  },
});
