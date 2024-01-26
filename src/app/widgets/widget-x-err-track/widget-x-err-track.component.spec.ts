import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetXErrTrackComponent } from './widget-x-err-track.component';

describe('WidgetXErrTrackComponent', () => {
  let component: WidgetXErrTrackComponent;
  let fixture: ComponentFixture<WidgetXErrTrackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetXErrTrackComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetXErrTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
