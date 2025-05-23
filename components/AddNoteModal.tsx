import { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { Color } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface AddNoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  editNote?: { title: string; content: string };
}

const TITLE_MAX_LENGTH = 80;

// Modal component for creating/editing notes
export const AddNoteModal = ({ visible, onClose, onSave, editNote }: AddNoteModalProps) => {
  const [title, setTitle] = useState(''); // Note title state
  const [content, setContent] = useState(''); // Note content state

  // Reset form or populate for editing
  useEffect(() => {
    if (visible) {
      editNote ? setTitle(editNote.title) : setTitle('');
      editNote ? setContent(editNote.content) : setContent('');
    } else {
      setTitle(''); 
      setContent('');
    }
  }, [visible, editNote]);

  // Validate and save note
  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return Alert.alert('Error', 'Title required');
    if (trimmedTitle.length > TITLE_MAX_LENGTH) return Alert.alert('Error', `Max ${TITLE_MAX_LENGTH} chars`);
    
    onSave(trimmedTitle, content.trim());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <View style={styles.modalOverlay}>
        {/* Main content container */}
        <ThemedView style={styles.modalContent}>
          
          {/* Header with dynamic title */}
          <View style={styles.modalHeader}>
            <ThemedText type="title">
              {editNote ? 'Edit Note' : 'New Note'}
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={Color.dark.text} />
            </TouchableOpacity>
          </View>

          {/* Title input with character counter */}
          <View>
            <TextInput
              style={styles.input}
              placeholder="Note title"
              placeholderTextColor={Color.dark.textSecondary}
              value={title}
              onChangeText={setTitle}
              autoFocus
              maxLength={TITLE_MAX_LENGTH}
            />
            <ThemedText style={styles.charCounter}>
              {title.length}/{TITLE_MAX_LENGTH}
            </ThemedText>
          </View>

          {/* Multiline content input */}
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description"
            placeholderTextColor={Color.dark.textSecondary}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
          />

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <ThemedText style={styles.buttonText}>
                {editNote ? 'Update' : 'Save'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: '30%',
  },
  modalContent: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: Color.dark.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    color: Color.dark.text,
    marginBottom: 16,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Color.dark.tint,
  },
  cancelButton: {
    backgroundColor: Color.dark.backgroundSecondary,
  },
  buttonText: {
    fontSize: 16,
  },
  charCounter: {
    position: 'absolute',
    right: 12,
    bottom: 28,
    fontSize: 12,
    color: Color.dark.textSecondary,
  },
});