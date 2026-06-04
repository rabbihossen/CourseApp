/**
 * Environment configuration.
 *
 * Values are resolved in priority order:
 *   1. react-native-config (injected at build time from .env / CI secrets)
 *   2. Hard-coded development fallbacks (safe to commit, public anon key)
 *
 * For production builds, set SUPABASE_URL and SUPABASE_ANON_KEY in your
 * CI environment or a .env.production file (excluded from git).
 */

// react-native-config is optional, app still works without it
let RNConfig: Record<string, string | undefined> = {};
try {
  RNConfig = require('react-native-config').default ?? {};
} catch {
  // Package not installed, fall through to process.env / defaults
}

function resolve(key: string, fallback: string): string {
  return RNConfig[key] ?? fallback;
}

const DEV_SUPABASE_URL = 'https://kdlnioqdqwlksfwauort.supabase.co';
const DEV_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkbG5pb3FkcXdsa3Nmd2F1b3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDg4ODgsImV4cCI6MjA5NjEyNDg4OH0.01Yz4XpacBSMCGztR25ndo5iEUUbBlvlLfeFPcokVaE';

export const ENV = {
  SUPABASE_URL: resolve('SUPABASE_URL', DEV_SUPABASE_URL),
  SUPABASE_ANON_KEY: resolve('SUPABASE_ANON_KEY', DEV_SUPABASE_ANON_KEY),
} as const;

if (__DEV__) {
  const usingDefaults =
    ENV.SUPABASE_URL === DEV_SUPABASE_URL &&
    ENV.SUPABASE_ANON_KEY === DEV_SUPABASE_ANON_KEY;
  if (usingDefaults) {
    console.warn('[ENV] Using built-in dev Supabase credentials. Set SUPABASE_URL / SUPABASE_ANON_KEY for other environments.');
  }
}
