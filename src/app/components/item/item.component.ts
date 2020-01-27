import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ITrack } from '../../types/interfaces';
import { AudioService } from 'src/app/services/audio.service';
import { displayMillisecInMinSec, getArtists } from '../../utils/utils';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @Input() track: ITrack;
  @Input() showArtist: boolean;
  @Output() newCurrentTrack = new EventEmitter<ITrack>();
  public state: any;

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.audioService.getState().subscribe((newState) => {
      this.state = newState;
    });
  }

  playPause(track: ITrack) {
    if (track.isPlaying) {
      this.pause(track);
    } else {
      this.play(track);
    }
  }

  pause(track: ITrack) {
    track.isPlaying = false;
    this.audioService.pause();
  }

  play(track: ITrack) {
    const id = this.audioService.getAudioID();
    if (id === track.id) {
      this.audioService.play();
    } else {
      this.playStream(track);
    }
  }

  playStream(track: ITrack) {
    this.newCurrentTrack.emit(track);
  }

  onSliderTimeChanged(change) {
    this.audioService.rewindTo(change.value);
  }

  convertMilliseconds(ms: number) {
    return displayMillisecInMinSec(ms);
  }

  getArtists(artists: any[]) {
    return getArtists(artists);
  }

  isActive() {
    return this.track.isPlaying || this.track.id === this.audioService.getAudioID();
  }
}
