import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription, Observable, interval } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { ModalWidgetComponent } from '../modal-widget/modal-widget.component';
import { SignalKService } from '../signalk.service';
import { WidgetManagerService, IWidget, IWidgetConfig } from '../widget-manager.service';
import { UnitsService } from '../units.service';

const defaultConfig: IWidgetConfig = {
    filterSelfPaths: true,
    useMetadata: false,
    useZone: false,
    paths: {
        "headingPath": {
            description: "Heading",
            path: 'self.navigation.courseOverGroundTrue',
            source: 'default',
            pathType: "number",
            isPathConfigurable: true,
            convertUnitTo: "deg"
        },
        "pointBearingPath": {
            description: "True bearing next point",
            path: 'self.navigation.courseRhumbline.nextPoint.bearingTrue',
            source: 'default',
            pathType: "number",
            isPathConfigurable: true,
            convertUnitTo: "deg"
        },
        "pointIDPath": {
            description: "Next point ID",
            path: 'self.navigation.courseRhumbline.nextPoint.ID',
            source: 'default',
            pathType: "string",
            isPathConfigurable: true,
            convertUnitTo: ""
        },
        "pointDistPath": {
            description: "Next Point Distance",
            path: 'self.navigation.courseRhumbline.nextPoint.distance',
            source: 'default',
            pathType: "number",
            isPathConfigurable: true,
            convertUnitTo: "m"
        },
        "pointVMGPath": {
            description: "Next Point Velocity Made God",
            path: 'self.navigation.courseRhumbline.nextPoint.velocityMadeGood',
            source: 'default',
            pathType: "number",
            isPathConfigurable: true,
            convertUnitTo: "m/s"
        },

    }
};
@Component({
    selector: 'app-widget-route',
    templateUrl: './widget-route.component.html',
    styleUrls: ['./widget-route.component.css']
})
export class WidgetRouteComponent implements OnInit, OnDestroy {

    @Input('widgetUUID') widgetUUID: string;
    @Input('unlockStatus') unlockStatus: boolean;

    activeWidget: IWidget;
    config: IWidgetConfig;

    currentHeading: number = 0;
    headingSub: Subscription = null;

    pointID: string = "";
    pointIDSub: Subscription = null;

    pointDist: number = null;
    pointDistSub: Subscription = null;

    pointBearing: number = null;
    pointBearingSub: Subscription = null;

    pointVMG: number = null;
    pointVMGSub: Subscription = null;

    constructor(
        public dialog: MatDialog,
        private SignalKService: SignalKService,
        private WidgetManagerService: WidgetManagerService,
        private UnitsService: UnitsService) {
    }


    ngOnInit() {
        this.activeWidget = this.WidgetManagerService.getWidget(this.widgetUUID);
        if (this.activeWidget.config === null) {
            // no data, let's set some!
            this.WidgetManagerService.updateWidgetConfig(this.widgetUUID, defaultConfig);
            this.config = defaultConfig; // load default config.
        } else {
            this.config = this.activeWidget.config;
        }
        this.startAll();
    }

    ngOnDestroy() {
        this.stopAll();
    }

    startAll() {
        this.subscribeHeading();
        this.subscribePointID();
        this.subscribePointDist();
        this.subscribePointBearing();
        this.subscribePointVMG();
    }

    stopAll() {
        this.unsubscribeHeading();
        this.unsubscribePointID();
        this.unsubscribePointDist();
        this.unsubscribePointBearing();
        this.unsubscribePointVMG();
    }

    subscribeHeading() {
        this.unsubscribeHeading();
        if (typeof (this.config.paths['headingPath'].path) != 'string') { return } // nothing to sub to...
        this.headingSub = this.SignalKService.subscribePath(this.widgetUUID, this.config.paths['headingPath'].path, this.config.paths['headingPath'].source).subscribe(
            newValue => {
                if (newValue === null) {
                    this.currentHeading = 0;
                } else {
                    this.currentHeading = this.UnitsService.convertUnit('deg', newValue);
                }

            }
        );
    }
    unsubscribeHeading() {
        if (this.headingSub !== null) {
            this.headingSub.unsubscribe();
            this.headingSub = null;
            this.SignalKService.unsubscribePath(this.widgetUUID, this.config.paths['headingPath'].path);
        }
    }
    subscribePointBearing() {
       let path: string = 'pointBearingPath';
        this.unsubscribePointBearing();
        if (typeof (this.config.paths[path].path) != 'string') { return } // nothing to sub to...
        this.headingSub = this.SignalKService.subscribePath(this.widgetUUID, this.config.paths[path].path, this.config.paths[path].source).subscribe(
            newValue => {
                if (newValue === null) {
                    this.pointBearing = null;
                } else {
                    this.pointBearing = this.UnitsService.convertUnit('deg', newValue);
                }
            }
        );
    }
    unsubscribePointBearing() {
        if (this.pointBearingSub !== null) {
            this.pointBearingSub.unsubscribe();
            this.pointBearingSub = null;
            this.SignalKService.unsubscribePath(this.widgetUUID, this.config.paths['pointBraringPath'].path);
        }
    }

    subscribePointID() {
        let path: string = 'pointIDPath';
        this.unsubscribePointBearing();
        if (typeof (this.config.paths[path].path) != 'string') { return } // nothing to sub to...
        this.headingSub = this.SignalKService.subscribePath(this.widgetUUID, this.config.paths[path].path, this.config.paths[path].source).subscribe(
            newValue => {
                if (newValue === null) {
                    this.pointID = "";
                } else {
                    this.pointID = newValue;
                }
            }
        );
    }
    unsubscribePointID() {
        if (this.pointIDSub !== null) {
            this.pointIDSub.unsubscribe();
            this.pointIDSub = null;
            this.SignalKService.unsubscribePath(this.widgetUUID, this.config.paths['pointIDPath'].path);
        }
    }
    subscribePointDist() {
        let path: string = 'pointDistPath';
        this.unsubscribePointDist();
        if (typeof (this.config.paths[path].path) != 'string') { return } // nothing to sub to...
        this.headingSub = this.SignalKService.subscribePath(this.widgetUUID, this.config.paths[path].path, this.config.paths[path].source).subscribe(
            newValue => {
                if (newValue === null) {
                    this.pointDist = null;
                } else {
                    this.pointDist = newValue;
                }
            }
        );
    }
    unsubscribePointDist() {
        if (this.pointDistSub !== null) {
            this.pointDistSub.unsubscribe();
            this.pointDistSub = null;
            this.SignalKService.unsubscribePath(this.widgetUUID, this.config.paths['pointDistPath'].path);
        }
    }
    subscribePointVMG() {
        let path: string = 'pointVMGPath';
        this.unsubscribePointVMG();
        if (typeof (this.config.paths[path].path) != 'string') { return } // nothing to sub to...
        this.headingSub = this.SignalKService.subscribePath(this.widgetUUID, this.config.paths[path].path, this.config.paths[path].source).subscribe(
            newValue => {
                if (newValue === null) {
                    this.pointVMG = null;
                } else {
                    this.pointVMG = newValue;
                }
            }
        );
    }
    unsubscribePointVMG() {
        if (this.pointDistSub !== null) {
            this.pointDistSub.unsubscribe();
            this.pointDistSub = null;
            this.SignalKService.unsubscribePath(this.widgetUUID, this.config.paths['pointVMGPath'].path);
        }
    }

    openWidgetSettings() {
        let dialogRef = this.dialog.open(ModalWidgetComponent, {
            width: '80%',
            data: this.config
        });

        dialogRef.afterClosed().subscribe(result => {
            // save new settings
            if (result) {
                console.log(result);
                this.stopAll();//unsub now as we will change variables so wont know what was subbed before...
                this.config = result;
                this.WidgetManagerService.updateWidgetConfig(this.widgetUUID, this.config);
                this.startAll();
            }

        });
    }

}
