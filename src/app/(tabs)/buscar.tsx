import React from 'react';
import { Redirect } from 'expo-router';

/**
 * Former 'buscar' tab route.
 * Redirects seamlessly to Inicio where the integrated search bar is located.
 */
export default function BuscarScreen() {
  return <Redirect href="/(tabs)" />;
}
