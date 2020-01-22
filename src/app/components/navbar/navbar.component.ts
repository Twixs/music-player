import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('navElement', { static: true }) navElement: ElementRef;

  constructor(private spotifyService: SpotifyApiService) {}

  ngOnInit() {
    this.spotifyService.getUser().subscribe(({ display_name, images }) => {
      this.username = display_name;
      this.profileImage = _.get(images[0], 'url', null);
    });

    const scrollTrackerElement = document.getElementById('scroll-tracker-element');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.navElement.nativeElement.style.backgroundColor =
            entry.intersectionRatio === 1 ? 'transparent' : '#181818';
        });
      },
      { threshold: [0, 1] }
    );

    observer.observe(scrollTrackerElement);
  }
}
