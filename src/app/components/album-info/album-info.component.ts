import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITrack } from 'src/app/types/interfaces';

@Component({
  selector: 'app-album-info',
  templateUrl: './album-info.component.html',
  styleUrls: ['./album-info.component.scss']
})
export class AlbumInfoComponent {
  @Input() coverImage: string;
  @Input() albumName: string;
  @Input() albumArtist: string;
  @Input() isPlaylistClosed: boolean;
  @Input() releaseDate: number;
  @Input() tracks: ITrack[];
  @Output() isPlaylistClosedOut = new EventEmitter<boolean>();


  constructor() { }

  togglePlaylist() {
    this.isPlaylistClosedOut.emit(!this.isPlaylistClosed);
  }

  getFullListeningTime() {
    const totalTime = this.tracks.reduce((acc, track) => acc + track.duration_ms, 0);
    return Math.round(totalTime / 60000);
  }
}
