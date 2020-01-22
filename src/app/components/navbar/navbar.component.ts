import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public username: string;
  public profileImage: string;
  public bgStyle;

  constructor(private spotifyService: SpotifyApiService) {}

  ngOnInit() {
    this.spotifyService.getUser().subscribe(({ display_name, images }) => {
      this.username = display_name;
      this.profileImage = _.get(images[0], 'url', null);
    });
  }

  addBackground() {
    return (this.bgStyle =
      window.pageYOffset > 0 ? { 'background-color': '#181818' } : { 'background-color': 'transparent' });
  }
}
