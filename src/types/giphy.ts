export interface GifImage {
    url: string;
    width: string;
    height: string;
    // Add optional fixed_width_still property
    fixed_width_still?: string; // Optional: static version of the GIF
}

export interface Gif {
    id: string;
    title: string;
    images: {
        original: GifImage;
        fixed_width: GifImage;
        fixed_height: GifImage;
        // Add fixed_width_still as part of the images object
        fixed_width_still: GifImage; // Static version for play/pause
    };
}