/**
 * MilePilot Expo entry.
 * expo-dev-client is required for EAS Development Builds (NOT Expo Go).
 * Background location task must register before the app mounts.
 */
import 'expo-dev-client';
import './src/locationTask';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
