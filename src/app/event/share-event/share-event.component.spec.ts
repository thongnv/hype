import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareEventComponent } from './share-event.component';

describe('ShareEventComponent', () => {
  let component: ShareEventComponent;
  let fixture: ComponentFixture<ShareEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
