import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'app-page-navigation',
  templateUrl: './page-navigation.component.html',
  styleUrls: ['./page-navigation.component.scss'],
})
export class PageNavigationComponent implements OnChanges {
  @Input() pageInfo: any;
  @Output() goToPage = new EventEmitter<string>();
  private albumsTotal: number;
  private nextPage: string;
  private prevPage: string;
  private page = 1;
  private pageCount: string;

  constructor() {}

  ngOnChanges() {
    const { limit, offset, previous, next, total } = this.pageInfo;
    this.nextPage = next;
    this.prevPage = previous;
    this.albumsTotal = Math.ceil(total / limit);
    this.page = offset / limit;
    this.pageCount = `${this.page + 1} of ${this.albumsTotal}`;
  }

  loadNextAlbums() {
    this.goToPage.next(this.nextPage);
  }

  loadPreviousAlbums() {
    this.goToPage.next(this.prevPage);
  }
}
