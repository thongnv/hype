import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurateDetailComponent } from './curate-detail.component';

describe('CurateDetailComponent', () => {
  let component: CurateDetailComponent;
  let fixture: ComponentFixture<CurateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
