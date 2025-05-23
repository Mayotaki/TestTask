import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import Animated, {
  useAnimatedRef,
  useScrollViewOffset
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = PropsWithChildren;

export default function ParallaxScrollView({
  children,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top;

  return (
    <ThemedView style={styles.container}>
      {/* Заголовок, закрывающий ТОЛЬКО безопасную зону */}
      <Animated.View
        style={[
          styles.header,
          { height: headerHeight },
          styles.fixedHeader,
        ]}
      />
      
      {/* Контент с отступом под безопасную зону */}
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ 
          paddingBottom: bottom,
          paddingTop: headerHeight, // Компенсация высоты безопасной зоны
        }}
      >
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    width: '100%',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});