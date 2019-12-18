import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatSliderModule,
  MatDividerModule,
  MatButtonModule
} from '@angular/material';

// modules
import { AppRoutingModule } from './app-routing.module';

// services
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { SpotifyApiService } from './services/spotify.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { AudioService } from './services/audio.service';

// components
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AlbumsListComponent } from './components/albums-list/albums-list.component';
import { TrackListComponent } from './components/track-list/track-list.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        MatSliderModule,
        MatDividerModule,
        MatButtonModule
      ],
      declarations: [
        AppComponent,
        SearchComponent,
        NavbarComponent,
        AlbumsListComponent,
        TrackListComponent,
      ],
      providers: [
        AuthService,
        HttpService,
        SpotifyApiService,
        AudioService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
