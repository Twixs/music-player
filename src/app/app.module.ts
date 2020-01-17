import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule, MatDividerModule, MatButtonModule } from '@angular/material';

// modules
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// services
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { SpotifyApiService } from './services/spotify.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { AudioService } from './services/audio.service';
import { LoaderService } from './services/loader.service';

// components
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AlbumsListComponent } from './components/albums-list/albums-list.component';
import { TrackListComponent } from './components/track-list/track-list.component';
import { ItemComponent } from './components/item/item.component';
import { PageNavigationComponent } from './components/page-navigation/page-navigation.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { GridListComponent } from './components/grid-list/grid-list.component';
import { AlbumInfoComponent } from './components/album-info/album-info.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MusicControlsComponent } from './components/music-controls/music-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    NavbarComponent,
    AlbumsListComponent,
    TrackListComponent,
    ItemComponent,
    PageNavigationComponent,
    CategoriesComponent,
    HomeComponent,
    CategoryComponent,
    GridListComponent,
    AlbumInfoComponent,
    LoaderComponent,
    MusicControlsComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSliderModule,
    MatDividerModule,
    MatButtonModule,
  ],
  providers: [
    AuthService,
    HttpService,
    SpotifyApiService,
    AudioService,
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
