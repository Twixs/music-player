import { Component } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { StreamState, ITrack } from '../../types/interfaces';
import { displayMillisecInMinSec } from '../../utils/utils';

@Component({
  selector: 'app-music-controls',
  templateUrl: './music-controls.component.html',
  styleUrls: ['./music-controls.component.scss']
})
export class MusicControlsComponent {
  public state: StreamState;
  public currentAudioID: string;
  public currentTrackList: ITrack[];
  public currentTrack: ITrack;

  constructor(
    private audioService: AudioService
  ) {
    this.listenAudioService();
    this.listenAudioChanges();
  }

  listenAudioService() {
    this.audioService.getState().subscribe(newState => {
      this.state = newState;
    })
  }

  listenAudioChanges() {
    this.audioService.getAudioIDChange().subscribe(newAudioID => {
      if (this.currentAudioID !== newAudioID) {
        this.currentAudioID = newAudioID;
        this.getAudioDetails();
      }
    })
  }

  getAudioDetails() {
    this.currentTrackList = this.audioService.getTrackList();
    this.currentTrack = this.currentTrackList.find(track => track.id === this.currentAudioID);
  }

  convertTime(time: number) {
    return displayMillisecInMinSec(time);
  }
}
