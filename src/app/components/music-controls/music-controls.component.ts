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
  public isAutorenewed: boolean = false;
  public isShuffled: boolean = false;
  public isTracksListEnd: boolean = false;

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
    const isLastAudio = this.currentTrack.track_number + 1 === this.currentTrackList.length;
    isLastAudio ? this.isTracksListEnd = true : this.isTracksListEnd = false;
  }

  convertTime(time: number) {
    return displayMillisecInMinSec(time);
  }

  playPause() {
    if (this.state.playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  play() {
    this.audioService.play()
  }

  pause() {
    this.audioService.pause()
  }

  playNextTrack() {
    this.audioService.playNextTrack()
  }

  playPreviousTrack() {
    this.audioService.playPreviousTrack()
  }

  rewindTo(change) {
    this.audioService.rewindTo(change.value)
  }

  autorenew() {
    this.isAutorenewed = !this.isAutorenewed;
    this.audioService.setAutorenew(this.isAutorenewed);
  }

  shuffle() {
    this.isShuffled = !this.isShuffled;
    this.audioService.setShuffle(this.isShuffled);
  }
}
