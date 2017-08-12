import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuratedCategoryComponent } from './curated-category.component';

describe('CuratedCategoryComponent', () => {
  let component: CuratedCategoryComponent;
  let fixture: ComponentFixture<CuratedCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuratedCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuratedCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
