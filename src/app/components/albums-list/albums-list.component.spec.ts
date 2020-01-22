import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsListComponent } from './albums-list.component';
import { NavbarComponent } from '../navbar/navbar.component';

import { SpotifyApiService } from '../../services/spotify.service';
import { HttpService } from '../../services/http.service';
import { PageNavigationComponent } from '../page-navigation/page-navigation.component';

describe('AlbumsListComponent', () => {
  let component: AlbumsListComponent;
  let fixture: ComponentFixture<AlbumsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [AlbumsListComponent, PageNavigationComponent],
      providers: [SpotifyApiService, HttpService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
