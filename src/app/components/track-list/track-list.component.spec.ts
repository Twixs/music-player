import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSliderModule, MatDividerModule } from '@angular/material';

import { TrackListComponent } from './track-list.component';
import { SpotifyApiService } from '../../services/spotify.service';
import { HttpService } from '../../services/http.service';

describe('TrackListComponent', () => {
  let component: TrackListComponent;
  let fixture: ComponentFixture<TrackListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSliderModule, MatDividerModule, HttpClientModule, RouterModule.forRoot([]), BrowserAnimationsModule],
      declarations: [TrackListComponent],
      providers: [SpotifyApiService, HttpService, { provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle playlist boolean', () => {
    expect(component.isPlaylistClosed).toBeTruthy();
    component.togglePlaylist();
    expect(component.isPlaylistClosed).toBeFalsy();
  });
});
