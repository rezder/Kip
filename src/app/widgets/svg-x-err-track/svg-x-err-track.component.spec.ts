import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SvgXErrTrackComponent } from './svg-x-err-track.component';

describe('SvgXErrTrackComponent', () => {
  let component: SvgXErrTrackComponent;
  let fixture: ComponentFixture<SvgXErrTrackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgXErrTrackComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgXErrTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
