import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.interfaces';
import { GifItem } from '../interfaces/gifs.interfaces';
import { GifMapper } from '../mapper/gifs.mapper';
import { map, Observable, tap } from 'rxjs';

const loadFromLocalStorage = (): Record<string, GifItem[]> => {
  const history = localStorage.getItem('history');

  return history ? JSON.parse(history) : {};
};

@Injectable({ providedIn: 'root' })
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<GifItem[]>([]);
  trendingGifsLoading = signal(false);
  private trendingPage = signal(0);
  private trendingGifsLength = computed(() => 20);

  searchHistory = signal<Record<string, GifItem[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  trendingGifGroup = computed<GifItem[][]>(() => {
    const groups: GifItem[][] = [];

    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }

    return groups;
  });

  constructor() {
    this.getTrendingGifs();
  }

  saveToLocalStorage = effect(() => {
    localStorage.setItem('history', JSON.stringify(this.searchHistory() || {}));
  });

  getTrendingGifs() {
    if (this.trendingGifsLoading()) return;
    this.trendingGifsLoading.set(true);
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: this.trendingGifsLength(),
          offset: this.trendingPage() * this.trendingGifsLength()
        }
      })
      .subscribe(res => {
        const gifs = GifMapper.mapGiphyItemsToGifItemArray(res.data);

        this.trendingGifs.update(prevList => [...prevList, ...gifs]);
        this.trendingPage.update(prevPage => prevPage + 1);
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string): Observable<GifItem[]> {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          offset: 0,
          limit: 20,
          q: query
        }
      })
      .pipe(
        map(({ data }) => GifMapper.mapGiphyItemsToGifItemArray(data)),
        tap(gifs => {
          this.searchHistory.update(history => ({
            ...history,
            [query.toLowerCase()]: gifs
          }));
        })
      );
  }

  getHistoryGifs(query: string): GifItem[] {
    return this.searchHistory()[query] || [];
  }
}
