import { StyleSheet } from 'react-native';

// Custom components for themed styling
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView>
      {/* Main header section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome</ThemedText>
      </ThemedView>

      {/* Feature highlight sections */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Quick Task creation</ThemedText>
        <ThemedText>
          Add tasks with titles, descriptions, and dates in seconds.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Real-time Updates</ThemedText>
        <ThemedText>
          Mark tasks as In Progress, Completed, or Cancelled. Delete or view details instantly.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Stay Organized</ThemedText>
        <ThemedText>
          Sort tasks by date or status. View all key info at a glance.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Minimal Design</ThemedText>
        <ThemedText>
          Nothing will distract you from your tasks.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20, // Added for better spacing
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16, // Increased spacing between sections
  },
  reactLogo: { // Currently unused - could be removed
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});