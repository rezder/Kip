import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetRouteComponent } from './widget-route.component';

describe('WidgetRouteComponent', () => {
  let component: WidgetRouteComponent;
  let fixture: ComponentFixture<WidgetRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});


