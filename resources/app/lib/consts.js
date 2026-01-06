// Query Keys Factory - Centralized key management
export const queryKeys = {
  // Auth
  auth: {
    user: ["auth", "user"],
  },

  // Profile
  profile: {
    all: ["profile"],
    detail: () => [...queryKeys.profile.all, "detail"],
  },

  // Users
  users: {
    all: ["users"],
    lists: () => [...queryKeys.users.all, "list"],
    list: (filters) => [...queryKeys.users.lists(), filters],
    details: () => [...queryKeys.users.all, "detail"],
  },
};
