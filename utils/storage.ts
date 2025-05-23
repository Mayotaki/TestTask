import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'BOOKMARKS_DATA';

export interface Bookmark {
  id: string;
  title: string;
  content: string;
}

export const storage = {
  async save(data: Bookmark[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  async load(): Promise<Bookmark[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
};