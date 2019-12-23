import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITrack } from '../../types/interfaces';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() track: ITrack;
  @Output() newCurrentTrack = new EventEmitter<ITrack>();
  public state: any;

  constructor(private audioService: AudioService) {
    this.audioService.getState().subscribe(newState => {
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
    track.isPlaying = true;
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

  displayMillisecInMinSec(ms: number) {
    const d = new Date(1000 * Math.round(ms / 1000));
    let seconds = d.getUTCSeconds().toString();
    seconds.length < 2 ? seconds = `0${seconds}` : seconds;
    return `${d.getUTCMinutes()}:${seconds}`;
  }

}
