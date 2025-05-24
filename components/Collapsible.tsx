import { useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

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
  onCancel,
  isMenuOpen,
  onMenuToggle,
}: {
  children: React.ReactNode;
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onMoveToInProgress?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
  isMenuOpen?: boolean;
  onMenuToggle?: (state: boolean) => void;
}) {
  const showMenu = isMenuOpen ?? false; 
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<TouchableOpacity>(null);

  const handleMenuToggle = () => {
    buttonRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setMenuPosition({
        top: pageY + height + 8,
        right: Dimensions.get('window').width - pageX - width + 8,
      });
    });
    onMenuToggle?.(!showMenu);
  };

  const handleMenuAction = (action?: () => void) => {
    onMenuToggle?.(false);
    action?.();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        {/* Header title button */}
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

        {/* Menu toggle button */}
        <TouchableOpacity 
          ref={buttonRef as React.RefObject<View>}
          onPress={handleMenuToggle}
          style={styles.menuButton}
        >
          <Feather name="more-vertical" size={20} color={Color.dark.icon} />
        </TouchableOpacity>

        {/* Context menu modal */}
        <Modal
          visible={showMenu}
          transparent
          animationType="fade"
          onRequestClose={handleMenuToggle}
        >
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={handleMenuToggle}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>

            <ThemedView 
              style={[
                styles.menu,
                { 
                  top: menuPosition.top,
                  right: menuPosition.right,
                }
              ]}
            >
              {[
                { id: 1, label: 'Edit', icon: 'edit' as const, action: onEdit },
                { id: 2, label: 'Delete', icon: 'trash-2' as const, action: onDelete },
                { id: 3, label: 'In Progress', icon: 'clock' as const, action: onMoveToInProgress },
                { id: 4, label: 'Complete', icon: 'check-circle' as const, action: onComplete },
                { id: 5, label: 'Cancel', icon: 'x-circle' as const, action: onCancel },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => {
                    onMenuToggle?.(false);
                    item.action?.();
                  }}
                >
                  <Feather name={item.icon} size={16} color={Color.dark.text} />
                  <ThemedText style={styles.menuText}>{item.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </View>
        </Modal>
      </View>

      {/* Collapsible content area */}
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
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
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 998,
  },
  menu: {
    position: 'absolute',
    backgroundColor: Color.dark.background,
    borderRadius: 8,
    padding: 12,
    minWidth: 160,
    elevation: 100,
    zIndex: 10000, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 40,
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