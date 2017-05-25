import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuratePreviewComponent } from './curate-preview.component';

describe('CuratePreviewComponent', () => {
  let component: CuratePreviewComponent;
  let fixture: ComponentFixture<CuratePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuratePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuratePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
