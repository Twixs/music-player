import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SpotifyApiService } from '../../services/spotify.service';
import { LoaderService } from '../../services/loader.service';
import { BackgroundImageService } from '../../services/background-image.service';

import get from 'lodash.get';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public categoryPlaylists: any = [];
  public coverImage: string;

  constructor(
    private spotifyService: SpotifyApiService,
    private route: ActivatedRoute,
    private loader: LoaderService,
    private background: BackgroundImageService
  ) {}

  ngOnInit() {
    this.loader.show();
    const { id } = this.route.snapshot.params;
    this.spotifyService.getCategoryPlaylist(id).subscribe(({ playlists }: any) => {
      const { items } = playlists;
      this.coverImage = get(items[0], 'images[0].url', null);
      this.background.updateBackgroundUrl(items[0].images[0]);
      this.categoryPlaylists = items;
      this.loader.hide();
    });
  }
}
