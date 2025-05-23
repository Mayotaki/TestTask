import { useState } from 'react';
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AddNoteModal } from '@/components/AddNoteModal';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Color } from '@/constants/Colors';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
}

// AsyncStorage key for persistent storage
const STORAGE_KEY = 'USER_NOTES';

// Available task categories
const CATEGORIES = [
  { id: '1', title: 'In Progress' },
  { id: '2', title: 'Completed' },
  { id: '3', title: 'Cancelled' },
];

export default function TabThreeScreen() {
  const [showSortOptions, setShowSortOptions] = useState(false);  // Sort menu visibility
  const [editingNote, setEditingNote] = useState<Note | null>(null);  // Note being edited
  const [isModalVisible, setIsModalVisible] = useState(false);  // Add/edit modal visibility
  const [selectedCategory, setSelectedCategory] = useState('1');  // Active category filter
  const [notes, setNotes] = useState<Note[]>([]);  // All stored notes
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'a-z' | 'z-a'>('newest');  // Sort method

  // Available sorting options configuration
  const sortOptions = [
    { id: 'newest', label: 'Newest' },
    { id: 'oldest', label: 'Oldest' },
    { id: 'a-z', label: 'A-Z' },
    { id: 'z-a', label: 'Z-A' },
  ];

  // Sort notes by selected criteria
  const getSortedNotes = (notes: Note[]) => {
    return [...notes].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      switch(sortBy) {
        case 'newest': return dateB - dateA;  // Descending date order
        case 'oldest': return dateA - dateB;  // Ascending date order
        case 'a-z': return a.title.localeCompare(b.title);  // Alphabetical
        case 'z-a': return b.title.localeCompare(a.title);  // Reverse alphabetical
        default: return 0;
      }
    });
  };

  // Load data
  const loadNotes = async () => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
        const parsedNotes = JSON.parse(storedData);
        // Миграция для старых записей без времени
        const migratedNotes = parsedNotes.map((note: Note) => ({
            ...note,
            date: note.date.includes(',') ? note.date : `${note.date}, 00:00`
        }));
        setNotes(migratedNotes);
        }
    } catch (error) {
        Alert.alert('Error', 'Failed to load notes');
    }
  };

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
                date: new Date().toISOString(),
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
            date: new Date().toISOString(),
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
    note.id === noteId ? { 
      ...note, 
      category: newCategory, // Используем переданный newCategory
      date: new Date().toISOString() // Обновляем дату изменения
    } : note
  );
  saveNotes(updatedNotes);
};
  
  // Filtered and sorted notes for display
  const filteredNotes = getSortedNotes(
    notes.filter(note => note.category === selectedCategory)
  );

  // Header component with controls
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTitleContainer}>
        <ThemedText type="title" style={styles.headerTitle}>Tasks</ThemedText>
      </View>
      
      <View style={styles.headerControls}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortOptions(!showSortOptions)}
        >
          <MaterialIcons name="sort" size={24} color={Color.dark.tint} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Feather name="plus-circle" size={28} color={Color.dark.tint} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.container}>
        {/* Render header with controls */}
        {renderHeader()}

        {/* Sorting dropdown menu */}
        {showSortOptions && (
          <ThemedView style={styles.sortDropdown}>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={styles.sortItem}
                onPress={() => {
                  setSortBy(option.id as typeof sortBy);
                  setShowSortOptions(false);
                }}
              >
                <ThemedText>{option.label}</ThemedText>
                {sortBy === option.id && (
                  <MaterialIcons name="check" size={18} color={Color.dark.tint} />
                )}
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}

        {/* Add/edit note modal */}
        <AddNoteModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setEditingNote(null);
          }}
          onSave={handleSaveNote}
          editNote={editingNote ? { title: editingNote.title, content: editingNote.content } : undefined}
        />

        {/* Category filter tabs */}
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

        {/* Conditional notes rendering */}
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
              onMoveToInProgress={() => updateNoteCategory(note.id, '1')} // In Progress
              onComplete={() => updateNoteCategory(note.id, '2')}         // Completed
              onCancel={() => updateNoteCategory(note.id, '3')}
            >
              <ThemedText>{note.content}</ThemedText>
              <ThemedText type="secondary" style={styles.noteDate}>
                Created: {new Date(note.date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
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
    position: 'relative',
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: '20%',
  },
  headerTitle: {
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
  headerControls: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  sortButton: {
    padding: 4,
  },
  sortDropdown: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 100,
    backgroundColor: Color.dark.background,
    borderRadius: 8,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 150,
  },
  sortItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});