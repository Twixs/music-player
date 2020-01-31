import { Component, Input, OnChanges } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss'],
})
export class SectionListComponent implements OnChanges {
  @Input() items: any[] = [];
  @Input() info: any;
  @Input() name: string;
  public pageInfo: any;
  public itemsTotal: number;

  constructor(private spotifyService: SpotifyApiService, private loader: LoaderService) {}

  ngOnChanges() {
    if (this.info) {
      const { total, limit } = this.info;
      this.itemsTotal = Math.ceil(total / limit);
      this.pageInfo = this.info;
    }
  }

  goToPage(nextPage: string) {
    this.loader.show();
    this.spotifyService.getNextAlbums(nextPage, this.name.slice(0, length - 1).toLowerCase());
  }
}
