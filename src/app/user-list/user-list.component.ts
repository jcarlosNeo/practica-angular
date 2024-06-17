import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: { id: number; name: string; email: string }[] = [];
  userIdToDelete: number | null = null;
  deleteModal: Modal | null = null;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.userService.getUsers();
  }

  createUser(): void {
    this.router.navigate(['/user-form']);
  }

  editUser(user: { id: number; name: string; email: string }): void {
    this.router.navigate(['/user-form', user.id]);
  }

  confirmDelete(id: number): void {
    this.userIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      this.deleteModal = new Modal(modalElement);
      this.deleteModal.show();
    }
  }

  deleteUser(): void {
    if (this.userIdToDelete !== null) {
      this.userService.deleteUser(this.userIdToDelete);
      this.loadUsers();
      this.userIdToDelete = null;
      if (this.deleteModal) {
        this.deleteModal.hide();
      }
    }
  }
}