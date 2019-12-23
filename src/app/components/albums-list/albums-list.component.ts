import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpotifyApiService } from '../../services/spotify.service';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit, OnDestroy {
  albums: any[] = [];
  subscription$: Subscription;
  noResultsMessage: string = '';

  constructor(private spotifyService: SpotifyApiService) {
  }

  ngOnInit() {
    this.getAlbums();
    this.updateList();
  }

  getAlbums() {
    this.spotifyService.getAlbums()
      .subscribe(
        ({ albums }: any) => {
          const { items } = albums;
          this.albums = items;
        },
        (error: any) => console.log(error));
  }

  updateList() {
    this.subscription$ = this.spotifyService.dataList$
      .subscribe(({ items }: any) => {
        if (!items.length) {
          this.noResultsMessage = 'No results found';
        }
        this.albums = items;
      });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

  getCoverImage(album: any) {
    return album && album.images.length ? album.images[1].url : '../assets/no-cover.jpg';
  }
}
