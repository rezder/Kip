import { Component, Input, ViewChild, ElementRef, SimpleChanges, AfterViewInit } from '@angular/core';

interface Move {
  from: string,
  to: string,
}
interface AnimationMove {
  move: Move,
  animationElement: ElementRef
}
interface AnimationScale {
  scale: Move,
  animationElement: ElementRef
}

@Component({
  selector: 'app-svg-waypoint-dist',
  templateUrl: './svg-waypoint-dist.component.html'
})

export class SvgWaypointDistComponent implements AfterViewInit {
  @ViewChild('boatAnimate', { static: true, read: ElementRef }) boatAnimate!: ElementRef;
  @ViewChild('circleAnimate', { static: true, read: ElementRef }) circleAnimate!: ElementRef;
  @Input('wpDist') wpDist: number;
  @Input('warnDist') warnDist: number;
  @Input('boatLenght') boatLenght: number;

  boat: AnimationMove;
  circle: AnimationScale;
  pxPrUnit: number;
  initLinePos: number;
  boatMidPx: number = 20;
  edgePos: number = 480;
  arrivePos: number = 35;
  constructor() {}
  ngAfterViewInit(): void {
    this.boat.animationElement = this.boatAnimate;
    this.circle.animationElement = this.circleAnimate;
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.warnDist && changes.warnDist.firstChange){
      this.pxPrUnit = (this.boatMidPx*2)/this.boatLenght; //Boat to scale
      this.boat =  {
        move:{
          from: "0",
          to: "0"},
        animationElement: undefined
      };
      if (this.warnDist*this.pxPrUnit > (this.edgePos-this.arrivePos)/3){
        this.pxPrUnit = 100/this.warnDist // Distance to line from arrive to scale
      }
      this.initLinePos = this.warnDist*this.pxPrUnit;
      let initScale = this.toScale(this.initLinePos);
      this.circle = {
        scale:{
          from: initScale,
          to: initScale
        },
        animationElement: undefined
      };
    }
    if (changes.wpDist){
      let newPos = changes.wpDist.currentValue*this.pxPrUnit;
      let moveBoatTo: number;
      let moveLineTo: number;
      if (newPos < this.edgePos-this.arrivePos){
        moveBoatTo = -(this.edgePos-this.arrivePos-newPos);
        moveLineTo = this.initLinePos;
      }else{ // edge
        moveBoatTo = 0;
        moveLineTo = (this.edgePos-this.arrivePos)*(this.warnDist/changes.wpDist.currentValue);// edge to middle to scale
      }
      this.moveTo(this.boat,moveBoatTo);
      this.scaleTo(this.circle,moveLineTo);
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

  private scaleTo(animMove:AnimationScale, to: number){
    animMove.scale.from = animMove.scale.to;
    animMove.scale.to = this.toScale(to);
    const diff = Number(animMove.scale.from)-Number(animMove.scale.to);
    if (animMove.animationElement && (diff != 0)){
      animMove.animationElement.nativeElement.beginElement();
    }
  }

  private toScale(scale: number): string{
    return (scale/100).toFixed(2);
  }
}
