import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { GifItem } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SearchPageComponent {
  gifService = inject(GifService);
  gifs = signal<GifItem[]>([]);

  onSearch(query: string) {
    this.gifService.searchGifs(query).subscribe(res => {
      this.gifs.set(res);
    });
  }
}
