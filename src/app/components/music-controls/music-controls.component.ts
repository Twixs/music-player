import { Component } from '@angular/core';
import { AudioService } from '../../services/audio.service';
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
  public isAutorenewed: boolean;
  public isShuffled: boolean;
  public isTracksListEnd: boolean = false;

  constructor(
    private audioService: AudioService
  ) {
    this.listenAudioService();
    this.listenAudioChanges();
    this.listenTrackListChanges();
    this.isAutorenewed = this.audioService.getAutorenew();
    this.isShuffled = this.audioService.getShuffle();
  }

  listenAudioService() {
    this.audioService.getState().subscribe(newState => {
      this.state = newState;
    })
  }

  listenAudioChanges() {
    this.audioService.getAudioIDChange().subscribe(newAudioID => {
      this.currentAudioID = newAudioID;
      this.currentTrackList = this.audioService.getTrackList();
      this.getAudioDetails();
    })
  }

  listenTrackListChanges() {
    this.audioService.getTrackListChange().subscribe((newTrackList: ITrack[]) => {
      this.currentTrackList = newTrackList;
      this.getAudioDetails();
    })
  }

  getAudioDetails() {
    this.currentTrack = this.currentTrackList.find(track => track.id === this.currentAudioID);
    if (this.currentTrack) {
      const isLastAudio = this.currentTrack.track_number + 1 === this.currentTrackList.length;
      isLastAudio ? this.isTracksListEnd = true : this.isTracksListEnd = false;
    }
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
