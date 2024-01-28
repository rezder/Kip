import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetRmbComponent } from './widget-rmb.component';

describe('WidgetRmbComponent', () => {
  let component: WidgetRmbComponent;
  let fixture: ComponentFixture<WidgetRmbComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetRmbComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetRmbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
