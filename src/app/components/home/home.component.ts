import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpotifyApiService } from '../../services/spotify.service';
import { LoaderService } from '../../services/loader.service';
import { BackgroundImageService } from '../../services/background-image.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public releases: any[] = [];
  public albums: any[] = [];
  public artists: any[] = [];
  public playlists: any[] = [];
  public subscription$: Subscription;

  constructor(
    private spotifyService: SpotifyApiService,
    private loader: LoaderService,
    private background: BackgroundImageService
  ) {}

  ngOnInit() {
    this.getNewReleases();
    this.updateList();
  }

  getNewReleases() {
    this.loader.show();
    this.spotifyService.getNewReleases().subscribe(
      ({ albums }: any) => {
        const { items } = albums;
        this.releases = items;
        this.background.updateBackgroundUrl(items[0].images[0]);
        this.loader.hide();
      },
      (error: any) => console.log(error)
    );
  }

  updateList() {
    this.subscription$ = this.spotifyService.dataList$.subscribe((data: any) => {
      if (!data) {
        this.loader.hide();
        return (this.albums = this.artists = this.playlists = []);
      }
      const { albums, artists, playlists } = data;
      if (albums && albums.items) this.albums = albums;
      if (artists && artists.items) this.artists = artists;
      if (playlists && playlists.items) this.playlists = playlists;
      this.loader.hide();
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
