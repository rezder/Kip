mport { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgRouteComponent } from './svg-route.component';

describe('SvgRouteComponent', () => {
  let component: SvgRouteComponent;
  let fixture: ComponentFixture<SvgRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

