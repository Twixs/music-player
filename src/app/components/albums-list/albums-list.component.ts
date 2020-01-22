import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpotifyApiService } from '../../services/spotify.service';
import { LoaderService } from 'src/app/services/loader.service';
import { BackgroundImageService } from 'src/app/services/background-image.service';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss'],
})
export class AlbumsListComponent implements OnInit, OnDestroy {
  public albums: any[] = [];
  public subscription$: Subscription;
  public albumsTotal: number;
  public pageInfo: any;

  constructor(
    private spotifyService: SpotifyApiService,
    private loader: LoaderService,
    private background: BackgroundImageService
  ) {}

  ngOnInit() {
    this.getAlbums();
    this.updateList();
  }

  getAlbums() {
    this.loader.show();
    this.spotifyService.getAlbums().subscribe(
      ({ albums }: any) => {
        const { items } = albums;
        this.albums = items;
        this.background.updateBackgroundUrl(items[0].images[0]);
        this.loader.hide();
      },
      (error: any) => console.log(error)
    );
  }

  updateList() {
    this.subscription$ = this.spotifyService.dataList$.subscribe((data: any) => {
      const { items, total, limit } = data;
      this.albums = items;
      this.pageInfo = data;
      this.albumsTotal = Math.ceil(total / limit);
      this.loader.hide();
    });
  }

  goToAlbums(nextPage: string) {
    this.loader.show();
    this.spotifyService.getNextAlbums(nextPage);
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
