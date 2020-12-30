import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { SocketService } from '../services/socket.service';
import { DiceComponent } from './dice/dice.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild(DiceComponent) diceComponent: DiceComponent;

  dice: number[] = [];
  totalPlayers: number = 0;

  result: Result = null;

  constructor(
    private sockets: SocketService,
    private gameService: GameService,
    private router: Router
  ) {

    if(this.multi) {
      this.connectToSocket();
    } else {
      this.gameService.yourTurn = true;
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if(this.multi) this.sockets.disconnect();
  }

  get gameStarted(): boolean {
    return this.gameService.gameStarted;
  }

  get turn(): string {
    return this.gameService.yourTurn ? 'Your turn' : 'Not your turn';
  }

  get multi(): boolean {
    return this.gameService.mode === 'multi';
  }

  get endScore(): number {
    return this.gameService.endScore;
  }

  get highestScore(): number {
    return Math.max(...this.result.totals);
  }

  connectToSocket() {
    // Connect to socket.io
    this.sockets.connect();

    // Listen to connect/disconnect events from server
    this.sockets.listen('player-joined').subscribe((d) => {
      this.totalPlayers = d;
    });
    this.sockets.listen('player-left').subscribe((d) => {
      this.totalPlayers = d;
    });

    // Listen to game events
    this.sockets.listen('start-game').subscribe(() => {
      this.gameService.gameStarted = true;
      this.gameService.endScore = 0;
    });
    this.sockets.listen('your-turn').subscribe(() => {
      this.gameService.turnEnded.next();
      this.gameService.yourTurn = true;
    });
    this.sockets.listen('end-game').subscribe((result) => {
      this.result = result;
    })
  }

  startGame() {
    this.sockets.emit('start-game');
  }

  setDice(data: number[]): void {
    this.dice = data;
  }

  playAgain() {
    this.dice = [];
    this.result = null;
    this.startGame();
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }
}

interface Result {
  winner: boolean,
  totals: number[]
}
