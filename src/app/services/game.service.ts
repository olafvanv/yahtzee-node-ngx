import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public mode: string = 'multi';
  public yourTurn: boolean = false;
  public gameStarted: boolean = false;
  public endScore: number = null;

  public turnEnded: EventEmitter<any> = new EventEmitter();

  constructor() {}

  public endTurn() {
    this.turnEnded.next(true);
  }
}
