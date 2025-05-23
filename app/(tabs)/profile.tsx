import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

// Custom components and utilities
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Color } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabTwoScreen() {
  // Handle complete data deletion with confirmation
  const handleDeleteAllData = async () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to delete all notes? This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('USER_NOTES');
              Alert.alert('Success', 'All data has been deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete data');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.container}>
        {/* Profile Header */}
        <ThemedView style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>Profile</ThemedText>
        </ThemedView>

        {/* App Information */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.infoItem}>
            <ThemedText type="defaultSemiBold">Version: </ThemedText>
            <ThemedText>0.0.1</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoItem}>
            <ThemedText type="defaultSemiBold">Developer: </ThemedText>
            <ThemedText>Egor Kavtaskin</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Data Management */}
        <ThemedView style={styles.section}>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAllData}
          >
            <Feather name="trash-2" size={20} color={Color.dark.text} />
            <ThemedText style={styles.dangerButtonText}>Delete All Data</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

// Styling for dark theme consistency
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: Color.dark.backgroundSecondary,
    borderRadius: 12,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.dark.danger,
    padding: 15,
    borderRadius: 8,
    gap: 10,
  },
  dangerButtonText: {
    color: Color.dark.text,
    fontWeight: '600',
  },
});