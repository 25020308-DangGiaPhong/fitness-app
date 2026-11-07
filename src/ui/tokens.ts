export const colors = {
  canvas: '#F5F3F0',
  surface: '#FFFFFF',
  surfaceMuted: '#ECE8E2',
  textPrimary: '#242424',
  textSecondary: '#625E5A',
  action: '#B94736',
  actionPressed: '#993A2C',
  onAction: '#FFFFFF',
  accentSurface: '#F7E5DF',
  border: '#D7D1C9',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  gutter: 20,
  xl: 24,
  xxl: 32,
  section: 40,
  generous: 48,
} as const;

export const radii = { control: 12, card: 16 } as const;

export const typography = {
  screenTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700', letterSpacing: -0.7 },
  title: { fontSize: 28, lineHeight: 35, fontWeight: '700', letterSpacing: -0.4 },
  heading: { fontSize: 21, lineHeight: 28, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontSize: 17, lineHeight: 25, fontWeight: '400' },
  bodyStrong: { fontSize: 17, lineHeight: 25, fontWeight: '600' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  caption: { fontSize: 14, lineHeight: 21, fontWeight: '400' },
} as const;
