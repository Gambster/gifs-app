import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { GifItem } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'app-trending-page',
  imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TrendingPageComponent {
  gifService = inject(GifService);
}
