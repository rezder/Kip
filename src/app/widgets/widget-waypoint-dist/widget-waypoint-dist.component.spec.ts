import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetWaypointDistComponent } from './widget-waypoint-dist.component';

describe('WidgetWaypointDistComponent', () => {
  let component: WidgetWaypointDistComponent;
  let fixture: ComponentFixture<WidgetWaypointDistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetWaypointDistComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetWaypointDistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
