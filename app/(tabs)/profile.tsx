import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Color } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabTwoScreen() {
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
        {/* Profile Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>Profile</ThemedText>
        </ThemedView>

        {/* Info Section */}
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

        {/* Danger Zone */}
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
  },
  dangerSectionTitle: {
    marginBottom: 15,
    color: Color.dark.danger,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
  },
  dangerButton: {
    marginTop: 20,
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