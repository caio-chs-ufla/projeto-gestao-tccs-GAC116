import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLoader } from './core';
import { UiToast } from './shared';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppLoader, UiToast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
