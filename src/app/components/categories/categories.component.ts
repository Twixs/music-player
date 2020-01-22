import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  public categories: any = [];

  constructor(private spotifyService: SpotifyApiService) {}

  ngOnInit() {
    this.spotifyService.getCategories().subscribe(({ categories }: any) => {
      const { items } = categories;
      this.categories = items;
    });
  }
}
