import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { ChangePasswordDialogComponent } from '../employees/change-password-dialog.component';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatListModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatDividerModule, MatDialogModule]
})
export class ShellComponent {
  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {
    this.authService.currentUser$.subscribe(user => {
      document.body.classList.remove('role-admin', 'role-manager', 'role-staff');
      if (!user?.role) return;
      const r = user.role.toLowerCase();
      if (r === 'admin') document.body.classList.add('role-admin');
      if (r === 'manager') document.body.classList.add('role-manager');
      if (r === 'employee') document.body.classList.add('role-staff');
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get role(): string | null {
    return this.authService.role;
  }

  changePassword(): void {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '450px',
      data: {}
    });
  }

  get employeeName(): string {
    return this.authService.currentUserValue?.employeeName ?? 'User';
  }
}
