import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { DashboardSummary } from '../models/dashboard.models';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class DashboardComponent implements OnInit {
  summary$: Observable<DashboardSummary>;

  constructor(private readonly dashboardService: DashboardService, public readonly auth: AuthService) {
    this.summary$ = this.dashboardService.getSummary();
  }

  ngOnInit(): void {}
}