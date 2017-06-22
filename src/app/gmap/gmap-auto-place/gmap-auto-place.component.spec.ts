import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmapAutoPlaceComponent } from './gmap-auto-place.component';

describe('GmapAutoPlaceComponent', () => {
  let component: GmapAutoPlaceComponent;
  let fixture: ComponentFixture<GmapAutoPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmapAutoPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmapAutoPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
