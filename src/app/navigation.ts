export interface NavigationItem {
  label: string;
  path: string;
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    label: 'Board',
    path: '/board',
  },
  {
    label: 'Analytics',
    path: '/analytics',
  },
];