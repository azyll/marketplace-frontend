interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_BASE_URL_MEDIA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
