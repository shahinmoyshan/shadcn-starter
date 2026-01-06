// Query Keys Factory - Centralized key management
export const queryKeys = {
  // Auth
  auth: {
    user: ["auth", "user"] as const,
  },

  // Profile
  profile: {
    all: ["profile"] as const,
    detail: () => [...queryKeys.profile.all, "detail"] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: unknown) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
  },
} as const;
