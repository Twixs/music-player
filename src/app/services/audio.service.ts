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
  public shuffledTrackList = [];
  audioEvents = ['ended', 'error', 'play', 'playing', 'pause', 'timeupdate', 'canplay', 'volumechange'];

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
    autorenew: false,
    shuffle: false,
  };

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state);
  private audioIDChange: BehaviorSubject<string> = new BehaviorSubject(this.audioID);
  private trackListChange: BehaviorSubject<ITrack[]> = new BehaviorSubject(this.trackList);

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
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        break;
      case 'volumechange':
        this.state.volume = this.audioObj.volume;
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
      autorenew: false,
      shuffle: false,
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
      };
    });
  }

  playStream({ preview_url, id }: ITrack, trackList?: ITrack[], albumId?: string) {
    this.audioID = id;
    this.audioIDChange.next(id);
    if (trackList && this.albumId !== albumId) {
      if (albumId) this.albumId = albumId;
      if (this.state.shuffle) this.shuffledTrackList = this.shuffleTrackList(trackList.slice());
      this.trackList = trackList;
      this.trackListChange.next(trackList);
    }
    this.streamObservable(preview_url)
      .pipe(takeUntil(this.stop$))
      .subscribe((event: Event) => {
        if (event.type === 'ended') {
          if (this.state.autorenew) {
            this.audioObj.currentTime = 0;
            return this.play();
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
  }

  rewindTo(seconds: number) {
    this.audioObj.currentTime = seconds;
  }

  setVolume(volume: number) {
    this.audioObj.volume = volume;
  }

  playNextTrack() {
    const currentTrack = this.trackList.find((track) => track.id === this.audioID);
    let nextTrack: ITrack;
    let isTrackListEnd: boolean;
    if (this.state.shuffle) {
      const currentTrackIndex = this.shuffledTrackList.map((track) => track.id).indexOf(currentTrack.id);
      nextTrack = this.shuffledTrackList[currentTrackIndex + 1];
      isTrackListEnd = this.shuffledTrackList.length === currentTrackIndex + 1;
    } else {
      nextTrack = this.trackList.find((track) => track.track_number - 1 === currentTrack.track_number);
      isTrackListEnd = this.trackList.length === currentTrack.track_number + 1;
    }
    this.stop();
    if (isTrackListEnd) {
      this.state.playing = false;
      return this.stateChange.next(this.state);
    }
    this.playStream(nextTrack);
  }

  playPreviousTrack() {
    const currentTrack = this.trackList.find((track) => track.id === this.audioID);
    let prevTrack: ITrack;
    let isTrackListStart: boolean;
    if (this.state.shuffle) {
      const currentTrackIndex = this.shuffledTrackList.map((track) => track.id).indexOf(currentTrack.id);
      prevTrack = this.shuffledTrackList[currentTrackIndex - 1];
      isTrackListStart = currentTrackIndex - 1 < 0;
    } else {
      prevTrack = this.trackList.find((track) => track.track_number === currentTrack.track_number - 1);
      isTrackListStart = currentTrack.track_number - 1 < 0;
    }
    this.stop();
    if (isTrackListStart) return this.playStream(currentTrack);
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
    this.state.autorenew = newValue;
    this.stateChange.next(this.state);
  }

  setShuffle(newValue) {
    this.state.shuffle = newValue;
    this.stateChange.next(this.state);
  }

  shuffleTrackList(array: ITrack[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    this.shuffledTrackList = array;
    return this.shuffledTrackList;
  }
}
