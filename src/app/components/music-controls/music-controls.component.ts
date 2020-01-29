import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { StreamState, ITrack } from '../../types/interfaces';
import { displayMillisecInMinSec, getArtists } from '../../utils/utils';
import { state, style, transition, animate, trigger } from '@angular/animations';

@Component({
  selector: 'app-music-controls',
  templateUrl: './music-controls.component.html',
  styleUrls: ['./music-controls.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0, 0, 0)',
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(0, 100%, 0)',
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),
  ],
})
export class MusicControlsComponent implements OnInit {
  public state: StreamState;
  public currentAudioID: string;
  public currentTrackList: ITrack[];
  public currentTrack: ITrack;
  public isAutorenewed: boolean;
  public isShuffled: boolean;
  public showTrackList = false;
  public isTracksListEnd = false;
  public isVolumeOff = false;

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.listenAudioService();
    this.listenAudioChanges();
    this.listenTrackListChanges();
  }

  listenAudioService() {
    this.audioService.getState().subscribe((newState) => {
      this.state = newState;
      this.isVolumeOff = newState.volume <= 0;
      this.isAutorenewed = newState.autorenew;
      this.isShuffled = newState.shuffle;
    });
  }

  listenAudioChanges() {
    this.audioService.getAudioIDChange().subscribe((newAudioID) => {
      this.currentAudioID = newAudioID;
      this.currentTrackList = this.isShuffled ? this.audioService.shuffledTrackList : this.audioService.getTrackList();
      this.getAudioDetails();
    });
  }

  listenTrackListChanges() {
    this.audioService.getTrackListChange().subscribe((newTrackList: ITrack[]) => {
      this.currentTrackList = this.isShuffled ? this.audioService.shuffledTrackList : newTrackList;
      this.getAudioDetails();
    });
  }

  getAudioDetails() {
    this.currentTrack = this.currentTrackList.find((track) => track.id === this.currentAudioID);
    if (this.currentTrack) {
      const currentTrackIndex = this.currentTrackList.map((track) => track.id).indexOf(this.currentTrack.id);
      this.isTracksListEnd = this.currentTrackList.length === currentTrackIndex + 1;
    }
  }

  convertTime(time: number) {
    return displayMillisecInMinSec(time);
  }

  playPause() {
    if (this.state.playing) {
      this.audioService.pause();
    } else {
      this.audioService.play();
    }
  }

  playNextTrack() {
    this.audioService.playNextTrack();
  }

  playPreviousTrack() {
    this.audioService.playPreviousTrack();
  }

  rewindTo(change) {
    this.audioService.rewindTo(change.value);
  }

  autorenew() {
    this.isAutorenewed = !this.isAutorenewed;
    this.audioService.setAutorenew(this.isAutorenewed);
  }

  shuffle() {
    this.isShuffled = !this.isShuffled;
    this.audioService.setShuffle(this.isShuffled);
    this.currentTrackList = this.isShuffled
      ? this.audioService.shuffleTrackList(this.currentTrackList.slice())
      : this.audioService.getTrackList();
    this.getAudioDetails();
  }

  setVolume(change) {
    this.audioService.setVolume(change.value);
  }

  openTracksList() {
    this.showTrackList = !this.showTrackList;
  }

  playStream(track: ITrack) {
    if (this.currentTrack) this.currentTrack.isPlaying = false;
    this.currentTrack = track;
    this.audioService.playStream(track);
  }

  getArtists(artists: any[]) {
    return getArtists(artists);
  }
}
