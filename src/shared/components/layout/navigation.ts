export const layoutNavItems = [
  { to: "/", labelKey: "home", namespace: "common" },
  { to: "/martyrs", labelKey: "martyrsList.title", namespace: "dashboard" },
  { to: "/share", labelKey: "shareMemory", namespace: "home" },
  { to: "/about", labelKey: "about.title", namespace: "dashboard" },
  { to: "/work", labelKey: "contribute.title", namespace: "dashboard" },
] as const;

export type LayoutNavItem = (typeof layoutNavItems)[number];
