import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatListModule, MatSidenavModule, MatToolbarModule]
})
export class ShellComponent {
  constructor(public readonly authService: AuthService, private readonly router: Router) {
    this.authService.currentUser$.subscribe(user => {
      // clear previous role classes
      document.body.classList.remove('role-admin', 'role-manager', 'role-staff');
      if (!user?.role) return;
      const role = user.role.toLowerCase();
      if (role === 'admin') document.body.classList.add('role-admin');
      if (role === 'manager') document.body.classList.add('role-manager');
      if (role === 'staff') document.body.classList.add('role-staff');
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}