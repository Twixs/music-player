import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyApiService } from '../../services/spotify.service';
import { LoaderService } from '../../services/loader.service';

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
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.loader.show();
    const { id } = this.route.snapshot.params;
    this.spotifyService.getCategoryPlaylist(id).subscribe(({ playlists }: any) => {
      const { items } = playlists;
      this.coverImage = this.getImage(items);
      this.categoryPlaylists = items;
      this.loader.hide();
    });
  }

  getCoverUrl() {
    if (this.coverImage) return 'url(' + this.coverImage + ')';
  }

  getImage(items: any) {
    return items[0] && items[0].images ? items[0].images[0].url : null;
  }
}
