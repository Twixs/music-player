import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public isDataLoading = new Subject<boolean>();

  show() {
    this.isDataLoading.next(true);
  }

  hide() {
    this.isDataLoading.next(false);
  }
}
