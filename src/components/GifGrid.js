import React from 'react';
import { FlatList, Dimensions } from 'react-native';
import GifItem from './GifItem';

const GifGrid = ({ gifs, onLoadMore, onGifPress }) => {
    const numColumns = 2;

    return (
        <FlatList
            data={gifs}
            numColumns={numColumns}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <GifItem
                    gif={item}
                    onPress={() => onGifPress(item)}
                />
            )}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
        />
    );
};