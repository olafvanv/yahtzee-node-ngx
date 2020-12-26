import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Die } from 'src/app/models/die';
import { SocketService } from 'src/app/services/socket.service';
import * as _ from 'lodash';
import { GameService } from 'src/app/services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss'],
})
export class DiceComponent implements OnInit, OnDestroy {
  @Output() result: EventEmitter<number[]> = new EventEmitter();

  throwsLeft: number = 3;
  dice: Die[] = [new Die(), new Die(), new Die(), new Die(), new Die()];
  multi: boolean = true;
  subs: Subscription = new Subscription();

  constructor(
    private sockets: SocketService,
    private gameService: GameService
  ) {
    this.multi = this.gameService.mode === 'multi';

    this.subs.add(
      this.gameService.turnEnded.subscribe(() => this.resetDice())
    );
  }

  ngOnInit(): void {
    // Listen to other players throws
    this.sockets.listen('dice-throw').subscribe((d) => {
      console.log('listen to dice throws', d);
      this.setDice(d);
    });

    this.sockets.listen('next-turn').subscribe(() => {
      this.resetDice();
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get disableRoll(): boolean {
    return !this.gameService.yourTurn || this.throwsLeft === 0;
  }

  rollDice(): void {
    if(this.throwsLeft === 0) return;

    // 'Animate' rolling dice
    const interval = setInterval(() => {
      this.dice.filter((d) => !d.locked).forEach((d) => d.roll());
    }, 30);

    // Cancel the animation after 600ms
    setTimeout(() => {
      clearInterval(interval);

      // Pass the result to the parent game component and substract remaining moves
      this.result.next(this.dice.map((d) => d.value));
      this.throwsLeft--;

      // Emit the throw results to other players
      if(this.multi) this.sockets.emit('dice-throw', this.dice)
    }, 600);
  }

  setDice(dice: Die[]) {
    // Create Die instances with the incoming values
    const rolledDice = _.map(dice, (d) => new Die(d.value, d.locked));
    // Set current dice locked if incoming dice are locked, otherwise the locked dice also animate
    this.dice.forEach((d: Die, i: number) => d.locked = rolledDice[i].locked);

    // Animation for the rolling
    const interval = setInterval(() => {
      this.dice.filter((d) => !d.locked).forEach((d) => d.roll());
    }, 30);

    // Stop animation and set the incoming values
    setTimeout(() => {
      clearInterval(interval);
      this.dice = rolledDice;
    }, 250);
  }

  resetDice(): void {
    this.dice = [new Die(), new Die(), new Die(), new Die(), new Die()];
    this.throwsLeft = 3;
  }
}


