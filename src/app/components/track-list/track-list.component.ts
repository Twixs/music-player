import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { state, style, transition, animate, trigger } from '@angular/animations';

import { SpotifyApiService } from '../../services/spotify.service';
import { AudioService } from '../../services/audio.service';
import { ITrack, StreamState } from '../../types/interfaces';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class TrackListComponent implements OnInit {
  public state: StreamState;
  public tracks: ITrack[] = [];
  public currentTrack: ITrack;
  public albumName: string;
  public albumId: string;
  public navigatedRoute: string;
  public coverImage: string;
  public isPlaylistClosed = true;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyApiService,
    private audioService: AudioService
  ) {
    this.audioService.getState().subscribe(newState => {
      this.state = newState;
    });
    this.audioService.getAudioIDChange().subscribe((id: string) => {
      const serviceAlbumId = this.audioService.getAlbumID();
      if (this.currentTrack && this.albumId === serviceAlbumId) {
        this.currentTrack.isPlaying = false;
        this.currentTrack = this.tracks.find(track => track.id === id);
        if (this.currentTrack) this.currentTrack.isPlaying = true;
      }
    })
  }

  ngOnInit() {
    this.albumId = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => {
      this.albumName = params.name;
      this.navigatedRoute = params.navigatedFrom;
    });
    if (this.navigatedRoute === 'tracks') {
      this.spotifyService.getAlbum(this.albumId)
        .subscribe(({ tracks, images }: any) => {
          const audioID = this.audioService.getAudioID();
          this.coverImage = images[0].url;
          this.tracks = tracks.items.map((track: ITrack) => {
            if (audioID === track.id) {
              this.currentTrack = track;
              track.isPlaying = true;
            }
            return track;
          });
        },
          (error: any) => {
            console.log(error)
          }
        );
    } else {
      this.spotifyService.getCategoryTracks(this.albumId)
        .subscribe(({ items }: any) => {
          const audioID = this.audioService.getAudioID();
          this.coverImage = items[0].track.album.images[0].url;
          this.tracks = items.map(({ track }, index: number) => {
            // renumbering tracks for proper audio order
            // TODO: first - filter tracks with preview_url, then do renumbering
            track.track_number = index;
            if (audioID === track.id) {
              this.currentTrack = track;
              track.isPlaying = true;
            }
            return track;
          });
        },
          (error: any) => {
            console.log(error)
          }
        );
    }
  }

  togglePlaylist() {
    this.isPlaylistClosed = !this.isPlaylistClosed;
  }

  getCoverUrl() {
    if (this.coverImage) return 'url(' + this.coverImage + ')';
  }

  playStream(track: ITrack) {
    if (this.currentTrack) this.currentTrack.isPlaying = false;
    this.currentTrack = track;
    this.audioService.playStream(track, this.tracks, this.albumId);
  }
}
