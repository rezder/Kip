import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { BaseWidgetComponent } from '../../base-widget/base-widget.component';


@Component({
  selector: 'app-widget-rmb',
  templateUrl: './widget-rmb.component.html'
})
export class WidgetRmbComponent extends BaseWidgetComponent implements OnInit, OnDestroy  {
  currentHeading: number = 0;
  pointID: string = null;
  pointBearing: number = 0;
  pointDist: number = null;
  pointVMG: number = null;
  crossTrack: number = null;

  constructor(private zones: NgZone){
    super();
    this.defaultConfig = {
      filterSelfPaths: true,
      paths: {
        "headingPath": {
          description: "Heading",
          path: 'self.navigation.courseOverGroundTrue',
          source: 'default',
          pathType: "number",
          isPathConfigurable: true,
          convertUnitTo: "deg",
          sampleTime: 500
        },
        "pointBearingPath": {
          description: "True bearing next point",
          path: 'self.navigation.courseRhumbline.nextPoint.bearingTrue',
          source: 'default',
          pathType: "number",
          isPathConfigurable: true,
          convertUnitTo: "deg",
          sampleTime: 500
        },
        "pointIDPath": {
          description: "Next point ID",
          path: 'self.navigation.courseRhumbline.nextPoint.ID',
          source: 'default',
          pathType: "string",
          isPathConfigurable: true,
          convertUnitTo: "",
          sampleTime: 500
        },
        "pointDistPath": {
          description: "Next Point Distance",
          path: 'self.navigation.courseRhumbline.nextPoint.distance',
          source: 'default',
          pathType: "number",
          isPathConfigurable: true,
          convertUnitTo: "nm",
          convertUnitToSmall:  "m",
          sampleTime: 500
        },
        "pointVMGPath": {
          description: "Next Point Velocity Made God",
          path: 'self.navigation.courseRhumbline.nextPoint.velocityMadeGood',
          source: 'default',
          pathType: "number",
          isPathConfigurable: true,
          convertUnitTo: "knots",
          sampleTime: 500
        },
        "crossTrackPath": {
          description: "The distance from the vessel's present position to the closest point on a line (track) between previousPoint and nextPoint.",
          path: 'self.navigation.courseRhumbline.crossTrackError',
          source: 'default',
          pathType: "number",
          isPathConfigurable: true,
          convertUnitTo: "m",
          sampleTime: 500
        },
      },
      waypointWarnDist: 100, //small Units
      crossTrackWarnDist: 25, //small Units
      enableTimeout: false,
      dataTimeout: 5
    };
  }
  ngOnInit(): void{
    this.validateConfig();
    this.observeDataStream('headingPath', newValue => {
      this.currentHeading = newValue.value;
    });
    this.observeDataStream('pointBearingPath', newValue => {
      this.pointBearing = newValue.value;
    });
    this.observeDataStream('pointIDPath', newValue => {
      this.pointID = newValue.value;
    });
    this.observeDataStream('pointDistPath', newValue => {
      this.pointDist = newValue.value;
    });
    this.observeDataStream('pointVMGPath', newValue => {
      this.pointVMG = newValue.value;
    });
    this.observeDataStream('crossTrackPath', newValue => {
      this.crossTrack = newValue.value;
    });
  }
  ngOnDestroy() {
    this.unsubscribeDataStream();
  }
  /**
   * This method returns the unit to convert the
   * data stream for the pathkey.

   * @param {string} pathKey the path
   * @return {*}  {string} the unit
   *@override
   */
  protected unit(pathKey: string): string{
    var res : string = "";
    switch (pathKey){
      case 'pointBearingPath':
      case 'headingPath':
        res = 'deg';
        break;
      case 'pointDistPath':
        res = 'm';
        break;
      case 'pointVMGPath':
        res = 'm/s';
        break;
      default:
        res = super.unit(pathKey)
    }
    return res
  }
}
