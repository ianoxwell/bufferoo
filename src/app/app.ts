import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from '@app/supabase.service';
import { Account } from '@pages/account/account';
import { Auth } from '@pages/auth/auth';
import { Session } from '@supabase/supabase-js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Auth, Account],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('bufferoo');
  session: Session | null = null;

  constructor(private readonly supabaseService: SupabaseService) {}

  async ngOnInit() {
    console.log('Initializing app...');
    // Initialize session properly
    this.session = await this.supabaseService.getSession();
    
    // Listen for auth changes
    this.supabaseService.authChanges((_, session) => {
      this.session = session;
    });
  }
}
