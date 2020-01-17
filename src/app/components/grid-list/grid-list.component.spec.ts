import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

import { AppRoutingModule } from '../../app-routing.module';
import { GridListComponent } from './grid-list.component';
import { HomeComponent } from '../home/home.component';
import { CategoryComponent } from '../category/category.component';
import { TrackListComponent } from '../track-list/track-list.component';
import { AlbumsListComponent } from '../albums-list/albums-list.component';

describe('GridListComponent', () => {
  let component: GridListComponent;
  let fixture: ComponentFixture<GridListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule],
      declarations: [GridListComponent, HomeComponent, CategoryComponent, TrackListComponent, AlbumsListComponent],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should display cover image of the album if images array is NOT EMPTY', () => {
    const album: any = {
      images: [
        {
          height: 640,
          url: 'https://i.scdn.co/image/9cc77a8f62923a063996321d437663469fbff5c6',
          width: 640,
        },
        {
          height: 300,
          url: 'https://i.scdn.co/image/ae074701eb87c0f1512a73142658868ebc1e0f92',
          width: 300,
        },
      ],
      name: 'Fine Line',
      type: 'album',
    };

    expect(component.getCoverImage(album)).toBe('https://i.scdn.co/image/ae074701eb87c0f1512a73142658868ebc1e0f92');
  });

  xit('should display no-cover image for the album if images array is EMPTY', () => {
    const albumWithNoCover: any = {
      images: [],
      name: 'Fine Line',
      type: 'album',
    };

    expect(component.getCoverImage(albumWithNoCover)).toBe('../assets/no-cover.jpg');
  });
});
