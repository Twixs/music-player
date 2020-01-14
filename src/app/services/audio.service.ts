import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { ITrack, StreamState } from '../types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private stop$ = new Subject();
  private audioObj = new Audio();
  private audioID: string;
  private albumId: string;
  private trackList: ITrack[] = [];
  private lastRandom: number[] = [];
  private isAutorenewed = false;
  private isShuffled = false;
  audioEvents = [
    'ended',
    'error',
    'play',
    'playing',
    'pause',
    'timeupdate',
    'canplay',
  ];

  private state: StreamState = {
    playing: false,
    paused: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
    volume: 0.8,
  };

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
    this.state
  );

  private audioIDChange: BehaviorSubject<string> = new BehaviorSubject(
    this.audioID
  );

  private trackListChange: BehaviorSubject<ITrack[]> = new BehaviorSubject(
    this.trackList
  );

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case 'playing':
        this.state.playing = true;
        this.state.paused = false;
        break;
      case 'pause':
        this.state.playing = false;
        this.state.paused = true;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState() {
    this.state = {
      playing: false,
      paused: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false,
      volume: 0.8,
    };
  }

  private streamObservable(url: string): any {
    return new Observable((observer) => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset state
        // this.resetState();
      };
    });
  }

  playStream(
    { preview_url, id }: ITrack,
    trackList?: ITrack[],
    albumId?: string
  ) {
    this.audioID = id;
    this.audioIDChange.next(id);
    if (albumId) this.albumId = albumId;
    if (trackList) {
      this.trackList = trackList;
      this.trackListChange.next(trackList);
      this.lastRandom = [];
    }
    this.streamObservable(preview_url)
      .pipe(takeUntil(this.stop$))
      .subscribe((event: Event) => {
        if (event.type === 'ended') {
          if (this.isAutorenewed) {
            this.audioObj.currentTime = 0;
            return this.play();
          }
          if (this.isShuffled) {
            return this.playStream(this.trackList[this.randomize()]);
          }
          this.playNextTrack();
        }
      });
  }

  private addEvents(obj, events, handler) {
    events.forEach((event) => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj, events, handler) {
    events.forEach((event) => {
      obj.removeEventListener(event, handler);
    });
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
    this.stop$.next();
    this.state.volume = this.audioObj.volume;
  }

  rewindTo(seconds: number) {
    this.audioObj.currentTime = seconds;
  }

  setVolume(volume: number) {
    this.audioObj.volume = volume;
    this.state.volume = volume;
    this.stateChange.next(this.state);
  }

  playNextTrack() {
    if (this.isShuffled) {
      return this.playStream(this.trackList[this.randomize()]);
    }
    const currentTrack = this.trackList.find(
      (track) => track.id === this.audioID
    );
    const nextTrack = this.trackList.find(
      (track) => track.track_number - 1 === currentTrack.track_number
    );
    const isTrackListEnd =
      this.trackList.length === currentTrack.track_number + 1;
    this.stop();
    if (isTrackListEnd) {
      this.audioIDChange.next(null);
      this.state.playing = false;
      this.state.paused = false;
      return this.stateChange.next(this.state);
    }
    this.playStream(nextTrack);
  }

  playPreviousTrack() {
    const currentTrack = this.trackList.find(
      (track) => track.id === this.audioID
    );
    const isTrackListStart = currentTrack.track_number - 1 < 0;
    this.stop();
    if (this.isShuffled) {
      const currentTrackIndex = this.lastRandom.indexOf(
        currentTrack.track_number
      );
      const prevRandomTrack = currentTrackIndex
        ? this.trackList[this.lastRandom[currentTrackIndex - 1]]
        : this.trackList[this.lastRandom[currentTrackIndex]];
      return this.playStream(prevRandomTrack);
    }
    if (isTrackListStart) return this.playStream(currentTrack);
    const prevTrack = this.trackList.find(
      (track) => track.track_number === currentTrack.track_number - 1
    );
    this.playStream(prevTrack);
  }

  formatTime(time: number, format: string = 'mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }

  getAudioID() {
    return this.audioID;
  }

  getAudioIDChange() {
    return this.audioIDChange.asObservable();
  }

  getTrackListChange(): Observable<ITrack[]> {
    return this.trackListChange.asObservable();
  }

  getAlbumID() {
    return this.albumId;
  }

  getTrackList() {
    return this.trackList;
  }

  setAutorenew(newValue) {
    this.isAutorenewed = newValue;
  }

  setShuffle(newValue) {
    this.isShuffled = newValue;
  }

  getAutorenew() {
    return this.isAutorenewed;
  }

  getShuffle() {
    return this.isShuffled;
  }

  randomize() {
    if (this.lastRandom.length === this.trackList.length) this.lastRandom = [];
    let nextTrack: number;
    do {
      nextTrack = Math.round(Math.random() * (this.trackList.length - 1));
    } while (this.lastRandom.includes(nextTrack));
    this.lastRandom.push(nextTrack);
    this.stop();
    return nextTrack;
  }
}
