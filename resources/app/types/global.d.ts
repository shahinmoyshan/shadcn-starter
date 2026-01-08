export {};

declare global {
  // Global CONFIG constant injected by PHP
  const CONFIG: AppConfig;

  interface Window {
    CONFIG: AppConfig;
  }

  interface AppConfig {
    app: {
      name: string;
      home_url?: string;
    };
    api_base_url: string;
    dashboard_prefix: string;
    csrf_token: string;
    user: User | null;
    privileges: Record<string, Record<string, string>>;
  }

  interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    display_name?: string;
    joined_at?: string;
    avatar_url?: string | null;
    privileges?: string[];
  }
}
