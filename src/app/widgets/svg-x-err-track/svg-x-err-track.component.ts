import { Component, Input, ViewChild, ElementRef, SimpleChanges, AfterViewInit } from '@angular/core';

interface Move {
  from: string,
  to: string
}
interface AnimationMove {
  move: Move,
  animationElement: ElementRef
}

@Component({
  selector: 'app-svg-x-err-track',
  templateUrl: './svg-x-err-track.component.html'
})

export class SvgXErrTrackComponent implements AfterViewInit {
  @ViewChild('boatAnimate', { static: true, read: ElementRef }) boatAnimate!: ElementRef;
  @ViewChild('lineLAnimate', { static: true, read: ElementRef }) lineLAnimate!: ElementRef;
  @ViewChild('lineRAnimate', { static: true, read: ElementRef }) lineRAnimate!: ElementRef;
  @Input('crossTrack') crossTrack: number;
  @Input('warnDist') warnDist: number;
  @Input('beam') beam: number;

  boat: AnimationMove;
  lineL: AnimationMove;
  lineR: AnimationMove;
  pxPrUnit: number;
  initLinePos: number;
  midPosPx: number = 250;
  boatMidPx: number = 10;
  constructor() {
  }
  ngAfterViewInit(): void {
    this.boat.animationElement = this.boatAnimate;
    this.lineL.animationElement = this.lineLAnimate;
    this.lineR.animationElement = this.lineRAnimate;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.warnDist && changes.warnDist.firstChange){
      this.pxPrUnit = (this.boatMidPx*2)/this.beam; //Boat to scale
      this.boat =  {
        move:{from: "0",
              to: "0"},
        animationElement: undefined
      };
      if (this.warnDist*this.pxPrUnit > this.midPosPx/2 ){
        this.pxPrUnit = (this.midPosPx/2)/this.warnDist; // Line distance to center to scale
      }
      this.initLinePos = -this.warnDist*this.pxPrUnit;
      let initPosTxt = this.initLinePos.toFixed(0);

      this.lineL =  {
        move:{from: initPosTxt,
              to: initPosTxt},
        animationElement: undefined
      };
      initPosTxt = (-this.initLinePos).toFixed(0);
      this.lineR =  {
        move:{from: initPosTxt,
              to: initPosTxt},
        animationElement: undefined
      };
    }
    if (changes.crossTrack){
      let newPos = changes.crossTrack.currentValue*this.pxPrUnit;
      let moveBoatTo: number;
      let moveLineTo: number;
      if (Math.abs(newPos) < this.midPosPx){
        moveBoatTo =  newPos;
        moveLineTo = this.initLinePos;
      }else{ // edge
        if (newPos < 0){
          moveBoatTo = -this.midPosPx;
        }else{
          moveBoatTo = this.midPosPx;
        }
        moveLineTo = -this.midPosPx*(this.warnDist/changes.crossTrack.currentValue);// edge to middle to scale
      }
      this.moveTo(this.boat,moveBoatTo);
      this.moveTo(this.lineL,moveLineTo);
      this.moveTo(this.lineR,-moveLineTo);
    }

  }
  private moveTo(animMove:AnimationMove, to: number){
    animMove.move.from = animMove.move.to;
    animMove.move.to = to.toFixed(0);
    const diff = Number(animMove.move.from)-Number(animMove.move.to);
    if (animMove.animationElement && (diff!=0)){
      animMove.animationElement.nativeElement.beginElement();
    }
  }
}
