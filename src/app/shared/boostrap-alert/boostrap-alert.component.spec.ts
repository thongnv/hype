import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostrapAlertComponent } from './boostrap-alert.component';

describe('BoostrapAlertComponent', () => {
  let component: BoostrapAlertComponent;
  let fixture: ComponentFixture<BoostrapAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoostrapAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostrapAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
