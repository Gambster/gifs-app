import { GifItem } from '../interfaces/gifs.interfaces';
import { GiphyItem } from '../interfaces/giphy.interfaces';

export class GifMapper {
  static mapGiphyItemToGifItem(item: GiphyItem): GifItem {
    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url
    };
  }

  static mapGiphyItemsToGifItemArray(items: GiphyItem[]): GifItem[] {
    return items.map(this.mapGiphyItemToGifItem);
  }
}
