import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {}

  startGame(mode: string) {
    this.gameService.mode = mode;
    this.router.navigateByUrl('/game');
  }
}
