import { Text, type TextProps } from 'react-native';

import { colors, typography } from './tokens';

type AppTextProps = TextProps & {
  variant?: keyof typeof typography;
  tone?: 'primary' | 'secondary';
};

export function AppText({ variant = 'body', tone = 'primary', style, ...props }: AppTextProps) {
  return (
    <Text
      {...props}
      allowFontScaling
      style={[
        typography[variant],
        { color: tone === 'primary' ? colors.textPrimary : colors.textSecondary },
        style,
      ]}
    />
  );
}
