import { Component, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { isNumber } from 'util';
import { UnitsService } from '../units.service';

@Component({
    selector: 'app-svg-route',
    templateUrl: './svg-route.component.html',
})
export class SvgRouteComponent {

    @ViewChild('compassAnimate') compassAnimate: ElementRef;
    @ViewChild('routeAnimate') routeAnimate: ElementRef;

    @Input('compassHeading') compassHeading: number;
    @Input('pointID') pointID: string; // goes straight through I hope TODO confirm
    @Input('pointBearing') pointBearing: number;
    @Input('pointDist') pointDist: number;
    @Input('pointVMG') pointVMG: number;
    constructor(private UnitsService: UnitsService){
}

//Compass
oldCompassRotate: number = 0;
newCompassRotate: number = 0;

//Bearing
oldPointBearingStr: string = "0";
newPointBearingStr: string = "0";
pointBearingTrue: number = 0;

//Distance
pointDistance: number = 0;
pointDistStr: string = "0";
pointDistUnit: string = "m";
//VMG
pointVMGVal: number = 0;
timeToArrivalStr: string = "?";

ngOnChanges(changes: SimpleChanges) {

    //heading
    if (changes.compassHeading) {
        if (!changes.compassHeading.firstChange) {
            this.oldCompassRotate = this.newCompassRotate;
            this.newCompassRotate = changes.compassHeading.currentValue;// .toString();
            this.compassAnimate.nativeElement.beginElement();
            this.updateRoute();// rotates with heading change
        }
    }
    //Bearing
    if (changes.pointBearing) {
        if (!changes.pointBearing.firstChange) {
            this.pointBearingTrue = changes.pointBearing.currentValue;
            this.updateRoute();
        }
    }
    let isUpdate: boolean = false;
    //Distance
    if (changes.pointDist) {
        if (!changes.pointDist.firstChange) {
            isUpdate = true;
            this.pointDistance = changes.pointDist.currentValue;
            if (this.pointDistance < 999) {
                this.pointDistStr = this.pointDistance.toFixed(0);
                this.pointDistUnit = "m";
            } else {
                this.pointDistStr = this.UnitsService.convertUnit('nm', this.pointDistance).toFixed(1);
                this.pointDistUnit = "nmi";
            }
        }
    }
    //VMG
    if (changes.pointVMG) {
        if (!changes.pointVMG.firstChange) {
            isUpdate = true;
            this.pointVMGVal = changes.pointVMG.currentValue;
        }
    }
    if (isUpdate) {
        this.updateTimeOfArrival();
    }

}
updateTimeOfArrival(){
    if (this.pointVMGVal < 1) {
        this.timeToArrivalStr = "?";
    } else {
        let ss = this.pointDistance / this.pointVMGVal;

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
updateRoute() {
    this.oldPointBearingStr = this.newPointBearingStr;
    this.newPointBearingStr = this.addHeading(this.pointBearingTrue, (this.newCompassRotate * -1)).toFixed(0); //compass rotate is negative as we actually have to rotate counter clockwise
    let oldAngle = Number(this.oldPointBearingStr)
    let newAngle = Number(this.newPointBearingStr);
    let diff = oldAngle - newAngle;

    // only update if on DOM and value rounded changed
    if (this.routeAnimate && (diff != 0)) {
        // Special cases to smooth out passing between 359 to/from 0
        // if more than half the circle, it could need to go over the 359 / 0 values
        if (Math.abs(diff) > 180) {
            // In what direction are we moving?
            if (Math.sign(diff) == 1) {
                if (oldAngle == 359) {
                    // special cases
                    this.oldPointBearingStr = "0";
                    this.routeAnimate.nativeElement.beginElement();
                } else {
                    this.newPointBearingStr = "359";
                    this.routeAnimate.nativeElement.beginElement();
                    this.oldPointBearingStr = "0";
                    this.newPointBearingStr = this.addHeading(this.pointBearingTrue, (this.newCompassRotate * -1)).toFixed(0);
                    this.routeAnimate.nativeElement.beginElement();
                }
            } else {
                if (oldAngle == 0) {
                    // special cases
                    this.oldPointBearingStr = "359";
                    this.routeAnimate.nativeElement.beginElement();
                } else {
                    this.newPointBearingStr = "0";
                    this.routeAnimate.nativeElement.beginElement();
                    this.oldPointBearingStr = "359";
                    this.newPointBearingStr = this.addHeading(this.pointBearingTrue, (this.newCompassRotate * -1)).toFixed(0);
                    this.routeAnimate.nativeElement.beginElement();
                }
            }
        } else {
            this.routeAnimate.nativeElement.beginElement();
        }
    }

}
addHeading(h1: number = 0, h2: number = 0) {
    let h3 = h1 + h2;
    while (h3 > 359) { h3 = h3 - 359; }
    while (h3 < 0) { h3 = h3 + 359; }
    return h3;
}
}
