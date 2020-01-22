import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNavigationComponent } from './page-navigation.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PageNavigationComponent', () => {
  let component: PageNavigationComponent;
  let fixture: ComponentFixture<PageNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageNavigationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
