import { StyleSheet, TouchableOpacity } from 'react-native';

import { Color } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';

export const FloatingActionButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <ThemedView style={styles.container}>
      <Feather name="plus" size={24} color={Color.dark.text} />
    </ThemedView>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    zIndex: 1,
  },
  container: {
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.dark.tint,
    elevation: 4,
  },
});