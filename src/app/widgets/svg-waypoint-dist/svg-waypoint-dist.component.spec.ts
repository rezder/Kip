import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SvgWaypointDistComponent } from './svg-waypoint-dist.component';

describe('SvgWaypointDistComponent', () => {
  let component: SvgWaypointDistComponent;
  let fixture: ComponentFixture<SvgWaypointDistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgWaypointDistComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgWaypointDistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
