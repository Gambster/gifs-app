import { Component, input } from '@angular/core';
import { GifListItemComponent } from './gif-list-item/gif-list-item.component';
import { GifItem } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'gifs-gif-list',
  imports: [GifListItemComponent],
  templateUrl: './gif-list.component.html'
})
export class GifListComponent {
  gifsList = input.required<GifItem[]>();
}
