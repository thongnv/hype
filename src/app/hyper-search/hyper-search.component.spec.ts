import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperSearchComponent } from './hyper-search.component';

describe('HyperSearchComponent', () => {
  let component: HyperSearchComponent;
  let fixture: ComponentFixture<HyperSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HyperSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
