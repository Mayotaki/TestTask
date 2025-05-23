import { StyleSheet, Text, type TextProps } from 'react-native';

import { Color } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'secondary' | 'link';
};

export function ThemedText({
  style,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const textColor = darkColor || Color.dark.text;
  const linkColor = darkColor || Color.dark.tint;

  return (
    <Text
      style={[
        { color: type === 'link' ? linkColor : textColor },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'secondary' ? styles.secondary : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#5409DA',
  },
  secondary: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  }
});
