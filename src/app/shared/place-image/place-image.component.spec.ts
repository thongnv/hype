import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceImageComponent } from './place-image.component';

describe('PlaceImageComponent', () => {
  let component: PlaceImageComponent;
  let fixture: ComponentFixture<PlaceImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
