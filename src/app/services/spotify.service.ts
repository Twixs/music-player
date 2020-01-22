import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { searchParamsAsObj } from '../utils/utils';

import { HttpService } from './http.service';

@Injectable()
export class SpotifyApiService {
  public dataList$ = new Subject<any>();

  constructor(private $http: HttpService) {}

  getAlbums() {
    const params = {
      endpoint: 'browse/new-releases',
      queryParams: {
        limit: 24,
        country: 'US',
      },
    };
    return this.$http.request(params);
  }

  getAlbum(id: string) {
    const params = {
      endpoint: `albums/${id}`,
      queryParams: {
        limit: 25,
        country: 'US',
      },
    };
    return this.$http.request(params);
  }

  searchMusic(q: string, offset: string = '0') {
    const params = {
      endpoint: 'search',
      queryParams: {
        q,
        type: 'album',
        limit: 24,
        offset,
      },
    };
    this.$http.request(params).subscribe(({ albums }: any) => {
      this.dataList$.next(albums);
    });
  }

  getNextAlbums(next: string) {
    const { query, offset } = searchParamsAsObj(next);
    this.searchMusic(query, offset);
  }

  getCategories() {
    const params = {
      endpoint: 'browse/categories',
      queryParams: {
        limit: 24,
        country: 'US',
      },
    };
    return this.$http.request(params);
  }

  getCategoryPlaylist(categoryID: string) {
    const params = {
      endpoint: `browse/categories/${categoryID}/playlists`,
      queryParams: {
        limit: 24,
        country: 'US',
      },
    };
    return this.$http.request(params);
  }

  getCategoryTracks(playlistID: string) {
    const params = {
      endpoint: `playlists/${playlistID}/tracks`,
      queryParams: {
        limit: 25,
        country: 'US',
      },
    };
    return this.$http.request(params);
  }

  getUser() {
    const params = {
      endpoint: 'me',
      queryParams: {},
    };
    return this.$http.request(params);
  }
}
