import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { state, style, transition, animate, trigger } from '@angular/animations';

import { SpotifyApiService } from '../../services/spotify.service';
import { AudioService } from '../../services/audio.service';
import { ITrack, StreamState } from '../../types/interfaces';
import { LoaderService } from '../../services/loader.service';
import { BackgroundImageService } from '../../services/background-image.service';

import { getArtists } from '../../utils/utils';
import get from 'lodash.get';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
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
          transform: 'translate3d(100%, 0, 0)',
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),
  ],
})
export class TrackListComponent implements OnInit {
  public state: StreamState;
  public tracks: ITrack[] = [];
  public currentTrack: ITrack;
  public albumName: string;
  public albumArtist: string;
  public releaseDate: number;
  public albumId: string;
  public routeType: string;
  public coverImage: string;
  public isPlaylistClosed = true;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyApiService,
    private audioService: AudioService,
    private loader: LoaderService,
    private background: BackgroundImageService
  ) {}

  ngOnInit() {
    this.loader.show();
    this.albumId = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe((params) => {
      this.albumName = params.name;
      this.routeType = params.type;
    });
    if (this.routeType === 'album') {
      this.spotifyService.getAlbum(this.albumId).subscribe(
        ({ tracks, images, artists, release_date }: any) => {
          this.coverImage = get(images[0], 'url', null);
          this.background.updateBackgroundUrl(images[0]);
          this.albumArtist = getArtists(artists);
          this.releaseDate = new Date(release_date).getFullYear();
          const { items } = tracks;
          this.filterTracksWithPreviewURL(items);
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else if (this.routeType === 'playlist') {
      this.spotifyService.getCategoryTracks(this.albumId).subscribe(
        ({ items }: any) => {
          this.coverImage = get(items[0], 'track.album.images[0].url', null);
          this.background.updateBackgroundUrl(items[0].track.album.images[0]);
          const tracks = items.map(({ track }) => track);
          this.filterTracksWithPreviewURL(tracks);
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.spotifyService.getArtistTopTracks(this.albumId).subscribe(({ tracks }: any) => {
        this.coverImage = get(tracks[0], 'album.images[0].url', null);
        this.background.updateBackgroundUrl(tracks[0].album.images[0]);
        this.albumArtist = getArtists(tracks[0].artists);
        this.filterTracksWithPreviewURL(tracks);
      });
    }
    this.audioService.getState().subscribe((newState) => {
      this.state = newState;
      if (this.currentTrack) this.currentTrack.isPlaying = this.state.playing;
    });
    this.audioService.getAudioIDChange().subscribe((id: string) => {
      const serviceAlbumId = this.audioService.getAlbumID();
      if (this.currentTrack && this.albumId === serviceAlbumId) {
        this.currentTrack.isPlaying = false;
        this.currentTrack = this.tracks.find((track) => track.id === id);
      }
    });
  }

  filterTracksWithPreviewURL(items: ITrack[]) {
    if (!items) return;
    const audioID = this.audioService.getAudioID();
    this.tracks = items
      .filter((track: ITrack) => track.preview_url)
      .map((track: ITrack, index: number) => {
        track.track_number = index;
        if (audioID === track.id) {
          this.currentTrack = track;
          track.isPlaying = true;
        }
        return track;
      });
    this.loader.hide();
  }

  togglePlaylist() {
    this.isPlaylistClosed = !this.isPlaylistClosed;
  }

  playStream(track: ITrack) {
    if (this.currentTrack) this.currentTrack.isPlaying = false;
    this.currentTrack = track;
    this.audioService.playStream(track, this.tracks, this.albumId);
  }
}
