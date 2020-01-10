import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isMusicPlaying: boolean;
  public isMusicPaused: boolean;

  constructor(
    private auth: AuthService,
    private audioService: AudioService
  ) {
    this.auth.authorize();
    this.audioService.getState().subscribe(({ playing, paused }) => {
      this.isMusicPlaying = playing;
      this.isMusicPaused = paused;
    })
  }
}
