import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AuthService } from './services/auth.service';
import { AudioService } from './services/audio.service';
import { LoaderService } from './services/loader.service';
import { BackgroundImageService } from './services/background-image.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private isMusicPlaying: boolean;
  private backgroundUrl: string;
  private isLoading: Observable<boolean> = this.loader.isDataLoading.pipe(delay(0));

  constructor(
    private auth: AuthService,
    private audioService: AudioService,
    private loader: LoaderService,
    private background: BackgroundImageService
  ) {}

  ngOnInit() {
    this.auth.authorize();
    this.audioService.getState().subscribe(({ playing, paused }) => {
      this.isMusicPlaying = playing || paused;
    });
    this.background.$backgroundUrl.subscribe((url) => (this.backgroundUrl = url));
  }
}
