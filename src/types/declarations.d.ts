declare module '@expo/vector-icons' {
  import React from 'react';
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  export const Ionicons: React.ComponentType<IconProps>;
  export const MaterialCommunityIcons: React.ComponentType<IconProps>;
  export const Feather: React.ComponentType<IconProps>;
  export const FontAwesome: React.ComponentType<IconProps>;
}
