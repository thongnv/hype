import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberNavigationComponent } from './member-navigation.component';

describe('MemberNavigationComponent', () => {
  let component: MemberNavigationComponent;
  let fixture: ComponentFixture<MemberNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
