import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public categoryPlaylists: any = [];
  public coverImage: string;

  constructor(
    private spotifyService: SpotifyApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const playlist_id = this.route.snapshot.paramMap.get('id');
    this.spotifyService.getCategoryPlaylist(playlist_id)
      .subscribe(({ playlists }: any) => {
        const { items } = playlists;
        this.coverImage = items[0].images[0].url
        this.categoryPlaylists = items;
      });
  }

  getCoverUrl() {
    if (this.coverImage) return 'url(' + this.coverImage + ')';
  }

}
