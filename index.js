/**
 * MilePilot Expo entry — background location task MUST load before the app.
 */
import './src/locationTask';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
