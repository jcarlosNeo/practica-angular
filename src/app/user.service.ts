import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersKey = 'users';

  constructor() { }

  getUsers(): any[] {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }

  getUserById(id: number): any {
    const users = this.getUsers();
    return users.find((user: any) => user.id === id);
  }

  createUser(user: any): void {
    const users = this.getUsers();
    user.id = this.generateId();
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  updateUser(id: number, updatedUser: any): void {
    const users = this.getUsers();
    const userIndex = users.findIndex((user: any) => user.id === id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
  }

  deleteUser(id: number): void {
    const users = this.getUsers();
    const updatedUsers = users.filter((user: any) => user.id !== id);
    localStorage.setItem(this.usersKey, JSON.stringify(updatedUsers));
  }

  private generateId(): number {
    const users = this.getUsers();
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  }
}