import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { debounce } from 'lodash';

const SearchBar = ({ onSearch, theme }) => {
    const debouncedSearch = debounce((text) => {
        onSearch(text);
    }, 500);

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme === 'dark' ? '#333' : '#eee',
                        color: theme === 'dark' ? COLORS.text.dark : COLORS.text.light
                    }
                ]}
                placeholder="Search GIFFs..."
                placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
                onChangeText={debouncedSearch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    input: {
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
    },
});

export default SearchBar;