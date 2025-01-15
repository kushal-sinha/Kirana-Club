import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { debounce } from 'lodash';
import { Gif } from '../../src/types/giphy';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../../src/context/ThemeContext';
import { useGiphySearch } from '@/hooks/useGiphySearch';
import { COLORS } from '@/constants/Colors';

const COLUMN_COUNT = 1;
const { width } = Dimensions.get('window');
const ITEM_WIDTH = 350 / COLUMN_COUNT;

export default function TabOneScreen() {
  const { theme } = useTheme(); // Access theme from ThemeContext
  const isDark = theme === 'dark'; // Determine if the theme is dark

  const [gifs, setGifs] = useState<Gif[]>([]); // Explicitly type state as Gif[]
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { loading, error, fetchGifs } = useGiphySearch();

  const loadGifs = useCallback(
    async (isNewSearch = false) => {
      const newOffset = isNewSearch ? 0 : offset;
      const endpoint = searchQuery ? 'search' : 'trending';
      const params = {
        limit: 20,
        offset: newOffset,
        ...(searchQuery && { q: searchQuery }),
      };

      const newGifs = await fetchGifs(endpoint, params);
      setGifs(isNewSearch ? newGifs : [...gifs, ...newGifs]);
      setOffset(newOffset + 20);
    },
    [offset, searchQuery, fetchGifs, gifs]
  );

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      loadGifs(true);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadGifs();
  }, []);

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchQuery(text);
    }, 500),
    []
  );

  const handleSearch = (text: string) => {
    debouncedSearch(text);
  };

  const handleShare = async (gif: Gif) => {
    try {
      await Share.share({
        url: gif.images.original.url,
        message: 'Check out this awesome GIF!',
      });
    } catch (error) {
      console.error('Error sharing GIF:', error);
    }
  };

  const handleDownload = async (gif: Gif) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${gif.id}.gif`;
      await FileSystem.downloadAsync(gif.images.original.url, fileUri);
      Alert.alert('Download Complete', `GIF saved to ${fileUri}`);
    } catch (error) {
      console.error('Error downloading GIF:', error);
      Alert.alert('Error', 'Failed to download GIF.');
    }
  };
  const GifItem = ({ gif }: { gif: Gif }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
      setIsPlaying((prev) => !prev);
    };

    return (
      <View style={styles.gifContainer}>
        {/* Play/Pause Toggle */}
        <TouchableOpacity onPress={togglePlayPause}>
          <Image
            source={{
              uri: isPlaying
                ? gif.images.fixed_width.url
                : gif.images.fixed_width_still?.url || gif.images.fixed_width.url,
            }}
            style={[
              styles.gif,
              {
                height:
                  (ITEM_WIDTH * parseInt(gif.images.fixed_width.height)) /
                  parseInt(gif.images.fixed_width.width),
              },
            ]}
          />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Share Button */}
          <TouchableOpacity style={styles.button} onPress={() => handleShare(gif)}>
            <Image
              source={require('../../src/assests/share.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Play/Pause Button */}
          <TouchableOpacity style={styles.button} onPress={togglePlayPause}>
            <Image
              source={
                isPlaying
                  ? require('../../src/assests/pause.png') // Replace with your actual pause icon
                  : require('../../src/assests/play-button.png') // Replace with your actual play icon
              }
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Download Button */}
          <TouchableOpacity style={styles.button} onPress={() => handleDownload(gif)}>
            <Image
              source={require('../../src/assests/download.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Gif }) => <GifItem gif={item} />;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? COLORS.background.dark : COLORS.background.light },
      ]}
    >
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: isDark ? '#333' : '#eee',
            color: isDark ? COLORS.text.dark : COLORS.text.light,
          },
        ]}
        placeholder="Search GIFs..."
        placeholderTextColor={isDark ? '#999' : '#666'}
        onChangeText={handleSearch}
      />

      {loading && <ActivityIndicator size="large" color={COLORS.primary} />}

      <FlatList
        data={gifs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        onEndReached={() => loadGifs()}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  listContainer: {
    padding: 4,
  },
  gifContainer: {
    flex: 1,
    padding: 4,
    position: 'relative',
  },
  gif: {
    width: ITEM_WIDTH,
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    padding: 8,
    borderRadius: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
});