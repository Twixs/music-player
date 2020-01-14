import { Component } from '@angular/core';
import { SpotifyApiService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  public username: string;
  public profileImage: string;

  constructor(private spotifyService: SpotifyApiService) {
    this.spotifyService.getUser().subscribe(({ display_name, images }) => {
      this.username = display_name;
      this.profileImage = images[0].url;
    });
  }
}
