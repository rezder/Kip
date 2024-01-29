import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { BaseWidgetComponent } from '../../base-widget/base-widget.component';


@Component({
  selector: 'app-widget-waypoint-dist',
  templateUrl: './widget-waypoint-dist.component.html'
})
export class WidgetWaypointDistComponent extends BaseWidgetComponent implements OnInit, OnDestroy  {
  waypointDist: number = 0;

  constructor(private zones: NgZone){
    super();
    this.defaultConfig = {
      filterSelfPaths: true,
      paths: {
        "waypointDistPath": {
          description: "The distance from the vessel's present position to the next Point.",
          path: 'self.navigation.courseRhumbline.nextPoint.distance',
          source: 'default',
          pathType: "number",
          isPathConfigurable: true,
          convertUnitTo: "m",
          sampleTime: 500
        },
      },
      waypointWarnDist: 100,
      waypointBoatLenght:8,
      enableTimeout: false,
      dataTimeout: 5
    };
  }
  ngOnInit(): void{
    this.validateConfig();
    this.observeDataStream('waypointDistPath', newValue => {
      if (newValue.value !== null){
        this.waypointDist = newValue.value;
      }else{
        this.waypointDist = 0;//TODO may make a connection lost sybol
      }
    });
  }
  ngOnDestroy() {
    this.unsubscribeDataStream();
  }
}
