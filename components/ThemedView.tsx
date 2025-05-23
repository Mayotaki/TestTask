import { Color } from '@/constants/Colors';
import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';

type ThemedViewProps = ViewProps & {
  darkColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function ThemedView({ style, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = darkColor ?? Color.dark.background;
  return <View style={[style, { backgroundColor }]} {...otherProps} />;
}