import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowItemComponent } from './follow-item.component';

describe('FollowItemComponent', () => {
  let component: FollowItemComponent;
  let fixture: ComponentFixture<FollowItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
