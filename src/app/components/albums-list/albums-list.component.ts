import { Component, Input, OnChanges } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss'],
})
export class AlbumsListComponent implements OnChanges {
  @Input() items: any[] = [];
  @Input() info: any;
  @Input() name: string;
  private pageInfo: any;
  private itemsTotal: number;

  constructor(private spotifyService: SpotifyApiService, private loader: LoaderService) {}

  ngOnChanges() {
    if (this.info) {
      const { total, limit } = this.info;
      this.itemsTotal = Math.ceil(total / limit);
      this.pageInfo = this.info;
    }
  }

  goToAlbums(nextPage: string) {
    this.loader.show();
    this.spotifyService.getNextAlbums(nextPage, this.name.slice(0, length - 1).toLowerCase());
  }
}
