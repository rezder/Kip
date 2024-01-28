import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SvgRmbComponent } from './svg-rmb.component';

describe('SvgRmbComponent', () => {
  let component: SvgRmbComponent;
  let fixture: ComponentFixture<SvgRmbComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgRmbComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgRmbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
