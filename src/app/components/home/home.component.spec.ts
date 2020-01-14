import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CategoriesComponent } from '../categories/categories.component';
import { SpotifyApiService } from '../../services/spotify.service';
import { HttpService } from '../../services/http.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [HomeComponent, NavbarComponent, CategoriesComponent],
      providers: [SpotifyApiService, HttpService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
