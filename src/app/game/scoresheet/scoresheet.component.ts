import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { GameService } from 'src/app/services/game.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-scoresheet',
  templateUrl: './scoresheet.component.html',
  styleUrls: ['./scoresheet.component.scss'],
})
export class ScoresheetComponent implements OnInit {
  @Input() dice: number[] = [];

  multi: boolean = false;

  scoresheet: IScoresheet;
  upperSection: IScoresheetRow[] = [
    {
      name: 'Ones',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.upperSection.find((f) => f.name === 'Ones');
        if (s.locked) return s.score;

        const count = _.countBy(this.dice);
        return count[1] || 0;
      },
    },
    {
      name: 'Twos',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.upperSection.find((f) => f.name === 'Twos');
        if (s.locked) return s.score;

        const count = _.countBy(this.dice);
        return count[2] * 2 || 0;
      },
    },
    {
      name: 'Threes',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.upperSection.find((f) => f.name === 'Threes');
        if (s.locked) return s.score;

        const count = _.countBy(this.dice);
        return count[3] * 3 || 0;
      },
    },
    {
      name: 'Fours',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.upperSection.find((f) => f.name === 'Fours');
        if (s.locked) return s.score;

        const count = _.countBy(this.dice);
        return count[4] * 4 || 0;
      },
    },
    {
      name: 'Fives',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.upperSection.find((f) => f.name === 'Fives');
        if (s.locked) return s.score;

        const count = _.countBy(this.dice);
        return count[5] * 5 || 0;
      },
    },
    {
      name: 'Sixes',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.upperSection.find((f) => f.name === 'Sixes');
        if (s.locked) return s.score;

        const count = _.countBy(this.dice);
        return count[6] * 6 || 0;
      },
    },
    {
      name: 'Bonus',
      score: 0,
      locked: true,
      class: 'bonus',
      calculate: () => {
        const total = this.upperSection
          .slice(0, 6)
          .map((m) => m.score)
          .reduce((a, b) => a + b, 0);
        let bonus: number = 0;
        if (total > 62) bonus = 35;

        return bonus;
      },
    },
    {
      name: 'Total',
      score: 0,
      locked: true,
      class: 'total',
      calculate: () => {
        return this.upperSection
          .slice(0, 7)
          .map((m) => m.score)
          .reduce((a, b) => a + b, 0);
      },
    },
  ];

  lowerSection: IScoresheetRow[] = [
    {
      name: '3 of a kind',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.lowerSection.find((f) => f.name === '3 of a kind');
        if (s.locked) return s.score;
        const dice = _.countBy(this.dice);
        const count = _.values(dice);
        let score = 0;

        if (
          count.indexOf(3) >= 0 ||
          count.indexOf(4) >= 0 ||
          count.indexOf(5) >= 0
        ) {
          score = _.sum(this.dice);
          return score;
        } else {
          return score;
        }
      },
    },
    {
      name: '4 of a kind',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.lowerSection.find((f) => f.name === '4 of a kind');
        if (s.locked) return s.score;
        const dice = _.countBy(this.dice);
        const count = _.values(dice);
        let score = 0;

        if (count.indexOf(4) >= 0 || count.indexOf(5) >= 0) {
          score = _.sum(this.dice);
          return score;
        } else {
          return score;
        }
      },
    },
    {
      name: 'Full House',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.lowerSection.find((f) => f.name === 'Full House');
        if (s.locked) return s.score;
        const dice = _.countBy(this.dice);
        const count = _.values(dice);

        if (count.indexOf(3) >= 0 && count.indexOf(2) >= 0) {
          return 25;
        } else {
          return 0;
        }
      },
    },
    {
      name: 'Small Straight',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.lowerSection.find((f) => f.name === 'Small Straight');
        if (s.locked) return s.score;
        const dice = _.sortedUniq(this.dice);
        const straight1 = [1, 2, 3, 4],
          straight2 = [2, 3, 4, 5],
          straight3 = [3, 4, 5, 6];

        if (
          _.intersection(straight1, dice).length === 4 ||
          _.intersection(straight2, dice).length === 4 ||
          _.intersection(straight3, dice).length === 4
        ) {
          return 30;
        } else {
          return 0;
        }
      },
    },
    {
      name: 'Large Straight',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.lowerSection.find((f) => f.name === 'Large Straight');
        if (s.locked) return s.score;
        const dice = _.sortedUniq(this.dice);
        const straight1 = [1, 2, 3, 4, 5],
          straight2 = [2, 3, 4, 5, 6];

        if (
          _.intersection(straight1, dice).length === 5 ||
          _.intersection(straight2, dice).length === 5
        ) {
          return 40;
        } else {
          return 0;
        }
      },
    },
    {
      name: 'Yahtzee',
      score: 0,
      locked: false,
      extra: 0,
      calculate: () => {
        const s = this.lowerSection.find((f) => f.name === 'Yahtzee');
        if(s.locked) return s.score;

        const dice = _.countBy(this.dice);
        const count = _.values(dice);

        if (count.indexOf(5) === 0) {
          return 50;
        }
        else {
          return 0;
        }
      },
    },
    {
      name: 'Chance',
      score: 0,
      locked: false,
      calculate: () => {
        const s = this.lowerSection.find((f) => f.name === 'Chance');
        if (s.locked) return s.score;
        return _.sum(this.dice);
      },
    },
    {
      name: 'Total',
      score: 0,
      locked: true,
      class: 'total',
      calculate: () => {
        return _.sum(this.lowerSection
          .slice(0, 7)
          .map((m) => m.score));
      },
    },
  ];

  constructor(
    private sockets: SocketService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.scoresheet = {
      upperSection: this.upperSection,
      lowerSection: this.lowerSection
    };

    this.sockets.listen('game-over').subscribe(() => {
      this.calculateTotalScore();
    });
  }

  /**
   * Select the score and lock the selected row
   * @param score
   */
  setScore(score: IScoresheetRow) {
    if (!this.dice || !this.dice.length || score.locked) return;

    // Check if the throw is a second or higher yahtzee
    const count = _.values(_.countBy(this.dice));
    const yahtzee = this.lowerSection.find(f => f.name === "Yahtzee");
    if(count.indexOf(5) > -1 && yahtzee.locked) {
      yahtzee.extra = ++yahtzee.extra;
    }

    score.score = score.calculate();
    score.locked = true;
    this.dice = [];

    // Check if all rows are locked, that means the game is over.
    if (
      _.every(this.upperSection, { locked: true }) &&
      _.every(this.lowerSection, { locked: true })
    ) {
      this.calculateTotalScore();
    } else {
      if(this.multi) {
        this.gameService.yourTurn = false;
        this.sockets.emit('end-turn');
      }
      this.gameService.endTurn();
    }
  }

  calculateTotalScore() {
    const totalUpper = this.upperSection.find((f) => f.name === 'Total');
    const totalLower = this.lowerSection.find((f) => f.name === 'Total');
    const extraYahtzees = this.lowerSection.find(f => f.name === "Yahtzee").extra;
    const total: number = totalUpper.calculate() + totalLower.calculate() + (100 * extraYahtzees);

    alert('Total points: ' + total + '!!');
  }
}

export interface IScoresheet {
  upperSection: IScoresheetRow[],
  lowerSection: IScoresheetRow[]
}

export interface IScoresheetRow {
  name: string;
  score: number;
  locked?: boolean;
  class?: string;
  extra?: number;
  calculate(): number;
}
