import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { EmployeeListItem } from '../models/employee.models';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  standalone: true,
  imports: [CommonModule, AsyncPipe, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule]
})
export class EmployeeListComponent implements OnInit {
  displayedColumns = ['employeeCode', 'fullName', 'email', 'departmentName', 'roleName'];
  searchControl = new FormControl('', { nonNullable: true });
  employees$!: Observable<EmployeeListItem[]>;

  constructor(private readonly employeeService: EmployeeService) {
    this.employees$ = this.employeeService.getAll();
  }

  ngOnInit(): void {
    this.employees$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term ? this.employeeService.search(term) : this.employeeService.getAll())
    );
  }
}