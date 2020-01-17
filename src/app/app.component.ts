import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AuthService } from './services/auth.service';
import { AudioService } from './services/audio.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isMusicPlaying: boolean;
  public isMusicPaused: boolean;
  public isLoading: Observable<boolean> = this.loader.isDataLoading.pipe(delay(0));

  constructor(private auth: AuthService, private audioService: AudioService, private loader: LoaderService) {
    this.auth.authorize();
  }

  ngOnInit() {
    this.audioService.getState().subscribe(({ playing, paused }) => {
      this.isMusicPlaying = playing;
      this.isMusicPaused = paused;
    });
  }
}
