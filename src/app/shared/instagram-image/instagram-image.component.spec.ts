import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramImageComponent } from './instagram-image.component';

describe('InstagramImageComponent', () => {
  let component: InstagramImageComponent;
  let fixture: ComponentFixture<InstagramImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstagramImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
