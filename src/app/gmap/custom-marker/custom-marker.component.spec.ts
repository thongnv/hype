import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMarkerComponent } from './custom-marker.component';

describe('CustomMarkerComponent', () => {
  let component: CustomMarkerComponent;
  let fixture: ComponentFixture<CustomMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
