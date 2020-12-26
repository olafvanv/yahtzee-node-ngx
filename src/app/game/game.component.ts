import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  multi: boolean = false;

  constructor(
    private sockets: SocketService,
    private gameService: GameService
  ) {

    if(this.gameService.mode === 'multi') this.connectToSocket();
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

  connectToSocket() {
    this.multi = true;
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
    });
    this.sockets.listen('your-turn').subscribe(() => {
      console.log('Your turn');
      this.gameService.turnEnded.next();
      this.gameService.yourTurn = true;
    });
  }

  startGame() {
    this.sockets.emit('start-game');
  }

  setDice(data: number[]): void {
    this.dice = data;
  }
}
