import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurateNewComponent } from './curate-new.component';

describe('CurateNewComponent', () => {
  let component: CurateNewComponent;
  let fixture: ComponentFixture<CurateNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurateNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
