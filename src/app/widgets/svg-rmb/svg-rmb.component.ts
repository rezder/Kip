import { Component, Input, ViewChild, ElementRef, SimpleChanges, AfterViewInit } from '@angular/core';
import { UnitsService } from '../../units.service';

interface ISVGRotationObject {
  oldDegreeIndicator: string,
  newDegreeIndicator: string,
  animationElement: ElementRef
}

@Component({
  selector: 'app-svg-rmb',
  templateUrl: './svg-rmb.component.html'
})
export class SvgRmbComponent implements AfterViewInit {

  @ViewChild('compassAnimate', { static: true, read: ElementRef }) compassAnimate!: ElementRef;
  @ViewChild('bearingAnimate', { static: true, read: ElementRef }) bearingAnimate!: ElementRef;
  @Input('compassHeading') compassHeading: number;
  @Input('pointID') pointID: string;
  @Input('pointBearing') pointBearing: number;
  @Input('pointDist') pointDist: number;
  @Input('pointVMG') pointVMG: number;
  @Input('unitVMG') unitVMG: string;
  @Input('crossTrack') crossTrack: number;
  @Input('unitLongD') unitLongD: string;
  @Input('unitShortD') unitShortD: string;
  @Input('waypointWarnDist') waypointWarnDist: number;
  @Input('crossTrackWarnDist') crossTrackWarnDist: number;

  compass: ISVGRotationObject;
  bearing: ISVGRotationObject;

  //Point Distance
  pointDistStr: string = "";
  pointDistUnit: string = "";
  pointWarn: boolean = false;

  //VMG
  pointVMGStr: string = "";
  timeToArrivalStr: string = "";
  //CrossTrack
  crossTrackLeftStr: string = "";
  crossTrackRightStr: string = "";
  crossTrackWarn: boolean = false;
  //Id
  pointIDStr="";


  constructor(private unitsService: UnitsService){
    this.compass = {
      oldDegreeIndicator: '0',
      newDegreeIndicator: '0',
      animationElement: undefined
    };
    this.bearing = {
      oldDegreeIndicator: '0',
      newDegreeIndicator: '0',
      animationElement: undefined
    };
  }
  ngAfterViewInit(): void {
    this.compass.animationElement = this.compassAnimate;
    this.bearing.animationElement = this.bearingAnimate;
  }
  ngOnChanges(changes: SimpleChanges) {
    //heading
    if (changes.compassHeading) {
      if (! changes.compassHeading.firstChange && changes.compassHeading.currentValue !== null) {
        this.compass.oldDegreeIndicator = this.compass.newDegreeIndicator;
        this.compass.newDegreeIndicator = changes.compassHeading.currentValue.toFixed(0);
        // rotates with heading change
        this.smoothCircularRotation(this.compass);
      }
    }
    //Bearing rotate on top of compass
    if (changes.pointBearing) {
      if (! changes.pointBearing.firstChange && changes.pointBearing.currentValue !== null) {
        this.bearing.oldDegreeIndicator = this.bearing.newDegreeIndicator;
        this.bearing.newDegreeIndicator = changes.pointBearing.currentValue.toFixed(0);
        // rotates with heading change
        this.smoothCircularRotation(this.bearing);
      }
    }
    let isUpdateTOA: boolean = false;
    //Distance
    if (changes.pointDist && changes.pointDist.currentValue !== null) {
      isUpdateTOA = true;
      let pointDistM = changes.pointDist.currentValue;
      let pointDistLong = this.unitsService.convertUnit(this.unitLongD, pointDistM);
      let pointDistShort = this.unitsService.convertUnit(this.unitShortD, pointDistM);
      if (pointDistLong < 1) {
        this.pointDistStr = pointDistShort.toFixed(0);
        this.pointDistUnit = this.unitShortD;
      } else {
        this.pointDistStr = pointDistLong.toFixed(1);
        this.pointDistUnit = this.unitLongD;
      }
      this.warnPoint(pointDistShort);
    }
    //VMG
    if (changes.pointVMG && changes.pointVMG.currentValue !== null){
      isUpdateTOA = true;
      var pointVMGms = changes.pointVMG.currentValue;
      this.pointVMGStr = this.unitsService.convertUnit(this.unitVMG,pointVMGms).toFixed(1);
    }
    if (isUpdateTOA) {
      this.updateTimeOfArrival();
    }
    //CrossTrackError
    if (changes.crossTrack && changes.crossTrack.currentValue !== null) {
      var cv = Number(changes.crossTrack.currentValue.toFixed(0));
      if (cv == 0){
        this.crossTrackRightStr = "0";
        this.crossTrackLeftStr = "0";
        this.crossTrackWarn = false;
      }else if (cv < 0){
        this.crossTrackLeftStr = this.truncateNum(999,(-cv).toFixed(0));
        this.crossTrackRightStr = "";
        this.warnCrossCheck(-cv);
      }else if (cv > 0){
        this.crossTrackRightStr = this.truncateNum(999,cv.toFixed(0));
        this.crossTrackLeftStr = "";
        this.warnCrossCheck(cv);
      }
    }
    if (changes.pointID){
      this.pointIDStr = changes.pointID.currentValue;
      if (changes.pointID.currentValue !== null){//ng changed "" to null
        var l: number = this.pointIDStr.length;
        if (l > 11){
          this.pointIDStr = this.pointIDStr.slice(l-11);
        }
      }else{
        this.pointIDStr="";
      }
    }
  }
  truncateNum(max: number,num: string): string {
    var res:string = num;
    if (Number(num) > max){
      res = String(max);
    }
    return res
  }

  warnPoint(shortDist: number): void{
    if (shortDist < this.waypointWarnDist){//Check type
      this.pointWarn = true;
    }else{
      this.pointWarn = false;
    }
  }
  warnCrossCheck(distance: number): void{
    if (distance > this.crossTrackWarnDist){//Check type
      this.crossTrackWarn = true;
    }else{
      this.crossTrackWarn = false;
    }
  }

  updateTimeOfArrival(): void{
    if (this.pointDist !== null && this.pointVMG !== null){
      if (this.pointVMG < 0.5) {
        //this.timeToArrivalStr = "?";
      } else {
        let ss = this.pointDist / this.pointVMG;//TODO check if this.pointVMG and pointDist equal to change.pointVMG.currentValue

        let hours = Math.floor(ss / 3600);
        let minutes = Math.floor((ss - (hours * 3600)) / 60);
        let seconds = Math.floor((ss - (hours * 3600) - (minutes * 60)));
        let duration: string = seconds.toString();

        if (seconds < 10) { duration = "0" + duration; }
        duration = minutes.toString() + ':' + duration;
        if (minutes < 10) { duration = "0" + duration; }
        duration = hours.toString() + ':' + duration;
        if (hours < 10) { duration = "0" + duration; }

        this.timeToArrivalStr = duration;
      }
    }
  }

  private smoothCircularRotation(rotationElement: ISVGRotationObject): void {
    const oldAngle = Number(rotationElement.oldDegreeIndicator);
    const newAngle = Number(rotationElement.newDegreeIndicator);
    const diff = oldAngle - newAngle;
    // only update if on DOM and value rounded changed
    if (rotationElement.animationElement && (diff != 0)) {
      // Special cases to smooth out passing between 359 to/from 0
      // if more than half the circle, it could need to go over the 359 to 0 without doing full full circle
      if ( Math.abs(diff) > 180 ) {
        // In what direction are we moving?
        if (Math.sign(diff) == 1) {
          if (oldAngle == 359) {
            // special cases
            rotationElement.oldDegreeIndicator = "0";
            rotationElement.animationElement.nativeElement.beginElement();
          } else {
            rotationElement.newDegreeIndicator = "359";
            rotationElement.animationElement.nativeElement.beginElement();
            rotationElement.oldDegreeIndicator = "0";
            rotationElement.newDegreeIndicator = newAngle.toFixed(0);
            rotationElement.animationElement.nativeElement.beginElement();
          }
        } else {
          if (oldAngle == 0) {
            // special cases
            rotationElement.oldDegreeIndicator = "359";
            rotationElement.animationElement.nativeElement.beginElement();
          } else {
            rotationElement.newDegreeIndicator = "0";
            rotationElement.animationElement.nativeElement.beginElement();
            rotationElement.oldDegreeIndicator = "359";
            rotationElement.newDegreeIndicator = newAngle.toFixed(0);
            rotationElement.animationElement.nativeElement.beginElement();
          }
        }
      } else {
        rotationElement.animationElement.nativeElement.beginElement();
           }
    }
  }
}
