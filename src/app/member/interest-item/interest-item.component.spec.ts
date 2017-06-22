import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestItemComponent } from './interest-item.component';

describe('InterestItemComponent', () => {
  let component: InterestItemComponent;
  let fixture: ComponentFixture<InterestItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
