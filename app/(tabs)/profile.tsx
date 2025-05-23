import { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AddNoteModal } from '@/components/AddNoteModal';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Color } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
}

const STORAGE_KEY = 'USER_NOTES';
const CATEGORIES = [
  { id: '1', title: 'In Progress' },
  { id: '2', title: 'Completed' },
  { id: '3', title: 'Cancelled' },
];

export default function TabThreeScreen() {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [notes, setNotes] = useState<Note[]>([]);

  // Load data
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) setNotes(JSON.parse(storedData));
      } catch (error) {
        Alert.alert('Error', 'Failed to load notes');
      }
    };
    loadNotes();
  }, []);

  // Save data
  const saveNotes = async (newNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (error) {
      Alert.alert('Error', 'Failed to save notes');
    }
  };

  // Add note
  const handleSaveNote = (title: string, content: string) => {
    if (editingNote) {
            // Редактирование существующей заметки
            const updatedNotes = notes.map(note => 
            note.id === editingNote.id 
                ? { 
                ...note, 
                title, 
                content: content.trim() || 'No description', 
                date: new Date().toLocaleDateString('en-US') 
                } 
                : note
            );
            saveNotes(updatedNotes);
            setEditingNote(null);
        } else {
            // Создание новой заметки
            const newNote: Note = {
            id: Date.now().toString(),
            title,
            content: content.trim() || 'No description',
            date: new Date().toLocaleDateString('en-US'),
            category: selectedCategory,
            };
            saveNotes([...notes, newNote]);
        }
    };

  // Delete note
  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Delete',
      'Delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => saveNotes(notes.filter(n => n.id !== noteId)) },
      ]
    );
  };

  // Move note between categories
  const updateNoteCategory = (noteId: string, newCategory: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, category: newCategory } : note
    );
    saveNotes(updatedNotes);
  };

  const filteredNotes = notes.filter(note => note.category === selectedCategory);

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.container}>
        {/* Header with add button */}
        <View style={styles.header}>
          <ThemedText type="title">Tasks</ThemedText>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Feather name="plus-circle" size={28} color={Color.dark.tint} />
          </TouchableOpacity>
        </View>

        <AddNoteModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setEditingNote(null);
          }}
          onSave={handleSaveNote}
          editNote={editingNote ? { title: editingNote.title, content: editingNote.content } : undefined}
        />

        {/* Category tabs */}
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.activeCategory
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <ThemedText 
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.activeCategoryText
                ]}
              >
                {item.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes list */}
        {filteredNotes.length === 0 ? (
          <ThemedText style={styles.empty}>No tasks found</ThemedText>
        ) : (
          filteredNotes.map(note => (
            <Collapsible
                key={note.id}
                title={note.title}
                onEdit={() => {
                    setEditingNote(note);
                    setIsModalVisible(true);
                }}
                onDelete={() => handleDeleteNote(note.id)}
                onMoveToInProgress={() => updateNoteCategory(note.id, '1')}
                onComplete={() => updateNoteCategory(note.id, '2')}
                onCancel={() => updateNoteCategory(note.id, '3')}
            >
              <ThemedText>{note.content}</ThemedText>
              <ThemedText type="secondary" style={styles.noteDate}>
                Created: {note.date}
              </ThemedText>
            </Collapsible>
          ))
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const { width } = Dimensions.get('window');
const CATEGORY_BUTTON_WIDTH = width / 3 - 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  categoryButton: {
    width: CATEGORY_BUTTON_WIDTH,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCategory: {
    backgroundColor: Color.dark.tint,
  },
  categoryText: {
    fontSize: 14,
    color: Color.dark.text,
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center',
    color: Color.dark.textSecondary,
    marginTop: 24,
  },
  noteDate: {
    marginTop: 8,
    fontSize: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rowContainer: {
    height: 50,
    backgroundColor: '#1a1b1e',
    borderRadius: 30,
  },
  listContent: {
    gap: 0,
    paddingHorizontal: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  selectedText: {
    color: '#fff',
  },
  selectedItem: {
    backgroundColor: Color.dark.tint,
    borderRadius: 30,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    height: 34,
    minWidth: 100,
  },
  title: {
    fontSize: 14,
    lineHeight: 16,
    marginRight: 4,
    includeFontPadding: false,
  },
  count: {
    fontSize: 14,
    lineHeight: 16,
    includeFontPadding: false,
  },
  actionButton: {
    backgroundColor: Color.dark.tint,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortText: {
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    padding: 8,
  },
  bookmarksContainer: {
    height: 50,
    marginBottom: 16,
  },
  noteContainer: {
    backgroundColor: Color.dark.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  emptyText: {
    color: Color.dark.textSecondary,
    fontStyle: 'italic',
  },
});