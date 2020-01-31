import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SpotifyApiService } from '../../services/spotify.service';
import { LoaderService } from '../../services/loader.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public searchString$ = new Subject<string>();

  @ViewChild('search', { static: false }) searchValue: ElementRef;

  constructor(private spotifyService: SpotifyApiService, private route: Router, private loader: LoaderService) {}

  ngOnInit() {
    this.searchString$.pipe(debounceTime(250), distinctUntilChanged()).subscribe((searchStr: string) => {
      if (searchStr) this.loader.show();
      if (window.location.href !== environment.REDIRECT_URI) this.route.navigate(['/']);
      return this.spotifyService.searchMusic(searchStr);
    });

    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url !== '/') this.searchValue.nativeElement.value = '';
    });
  }
}
