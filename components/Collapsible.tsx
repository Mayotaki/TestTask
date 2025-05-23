import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Color } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

export function Collapsible({ 
  children, 
  title,
  onEdit,
  onDelete,
  onMoveToInProgress,
  onComplete,
  onCancel
}: {
  children: React.ReactNode;
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onMoveToInProgress?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.titleContainer}
          onPress={() => setIsOpen(!isOpen)}
          activeOpacity={0.8}
        >
          <IconSymbol
            name="chevron.right"
            size={18}
            color={Color.dark.icon}
            style={[styles.icon, isOpen && { transform: [{ rotate: '90deg' }] }]}
          />
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setShowMenu(!showMenu)}
          style={styles.menuButton}
        >
          <Feather name="more-vertical" size={20} color={Color.dark.icon} />
        </TouchableOpacity>

        {showMenu && (
          <ThemedView style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onEdit?.();
              }}
            >
              <Feather name="edit" size={16} color={Color.dark.text} />
              <ThemedText style={styles.menuText}>Edit</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onDelete?.();
              }}
            >
              <Feather name="trash-2" size={16} color={Color.dark.text} />
              <ThemedText style={styles.menuText}>Delete</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onMoveToInProgress?.();
              }}
            >
              <Feather name="clock" size={16} color={Color.dark.text} />
              <ThemedText style={styles.menuText}>In Progress</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onComplete?.();
              }}
            >
              <Feather name="check-circle" size={16} color={Color.dark.text} />
              <ThemedText style={styles.menuText}>Complete</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onCancel?.();
              }}
            >
              <Feather name="x-circle" size={16} color={Color.dark.text} />
              <ThemedText style={styles.menuText}>Cancel</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </View>

      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: Color.dark.border,
    marginBottom: 12,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  menuButton: {
    padding: 8,
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 35,
    backgroundColor: Color.dark.background,
    borderRadius: 8,
    padding: 12,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 160,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuText: {
    marginLeft: 8,
    fontSize: 14,
  },
  content: {
    marginTop: 12,
    marginLeft: 26,
  },
});