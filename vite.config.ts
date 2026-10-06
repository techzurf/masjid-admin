import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const rawUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const rawKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  // Step 9: Diagnostic check during build
  if (!rawUrl || !rawKey) {
    console.error('\n' + '='.repeat(70));
    console.error('❌ [VITE BUILD DIAGNOSTIC] MISSING SUPABASE ENVIRONMENT VARIABLES:');
    if (!rawUrl) console.error('   • VITE_SUPABASE_URL is missing or empty.');
    if (!rawKey) console.error('   • VITE_SUPABASE_PUBLISHABLE_KEY is missing or empty.');
    console.error('   Notice: In Vite + React SPA, environment variables are bundled at BUILD TIME.');
    console.error('   They cannot be read dynamically from the server at runtime on Hostinger.');
    console.error('   Ensure .env or .env.production exists or set build environment variables.');
    console.error('='.repeat(70) + '\n');
  }

  const supabaseUrl = rawUrl || 'https://jsdlinmclorrdjzzlfhy.supabase.co';
  const supabasePublishableKey = rawKey || 'sb_publishable_7iwwMNOT3w2U47-damKzVg_ZOIfuUCe';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(supabasePublishableKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
