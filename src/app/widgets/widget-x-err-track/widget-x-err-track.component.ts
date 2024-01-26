import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { BaseWidgetComponent } from '../../base-widget/base-widget.component';


@Component({
  selector: 'app-widget-x-err-track',
  templateUrl: './widget-x-err-track.component.html'
})
export class WidgetXErrTrackComponent extends BaseWidgetComponent implements OnInit, OnDestroy  {
  crossTrack: number = 0;

  constructor(private zones: NgZone){
    super();
    this.defaultConfig = {
      filterSelfPaths: true,
      paths: {
        "crossTrackPath": {
          description: "The distance from the vessel's present position to the closest point on a line (track) between previous point and next point.",
          path: 'self.navigation.courseRhumbline.crossTrackError',
          source: 'default',
          pathType: "number",
          isPathConfigurable: true,
          convertUnitTo: "m",
          sampleTime: 500
        },
      },
      crossTrackWarnDist: 25,
      crossTrackBeam:3,
      enableTimeout: false,
      dataTimeout: 5
    };
  }
  ngOnInit(): void{
    this.validateConfig();
    this.observeDataStream('crossTrackPath', newValue => {
      if (newValue.value !== null){
        this.crossTrack = newValue.value;
      }else{
        this.crossTrack = 0;//TODO maybe make a connection lost sybol
      }
    });
  }
  ngOnDestroy() {
    this.unsubscribeDataStream();
  }
}
