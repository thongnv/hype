import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapAlertComponent } from './boostrap-alert.component';

describe('BootstrapAlertComponent', () => {
  let component: BootstrapAlertComponent;
  let fixture: ComponentFixture<BootstrapAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BootstrapAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BootstrapAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
