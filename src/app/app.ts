import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MokedUser } from './models/moked';
import { MokedService } from './services/mokedService';
import { LoginComponent } from './components/login/login.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, WorkspaceComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  isAuthenticated = false;
  allUsers: MokedUser[] = [];
  currentUser!: MokedUser;
  currentEmail = 'diretoria@moked.com.br';

  ngOnInit() {
    const snapshot = MokedService.getAuthorizedSnapshotForUser('usr-alta-gestao');
    this.allUsers = snapshot.allUsers;
    const defaultUser = this.allUsers.find((u) => u.role === 'alta_gestao') ?? this.allUsers[0];
    this.currentUser = defaultUser;
    this.currentEmail = defaultUser.email;
  }

  onLoginSuccess(event: { user: MokedUser; email: string }) {
    this.currentUser = event.user;
    this.currentEmail = event.email;
    this.isAuthenticated = true;
  }

  onLogout() {
    this.isAuthenticated = false;
  }
}
