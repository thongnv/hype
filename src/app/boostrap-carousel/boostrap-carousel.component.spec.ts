import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostrapCarouselComponent } from './boostrap-carousel.component';

describe('BoostrapCarouselComponent', () => {
  let component: BoostrapCarouselComponent;
  let fixture: ComponentFixture<BoostrapCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoostrapCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostrapCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
