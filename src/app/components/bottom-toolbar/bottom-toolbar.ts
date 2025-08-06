import { CommonModule } from '@angular/common';
import { Component, effect, signal, WritableSignal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SupabaseService } from '@core/supabase.service';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-bottom-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './bottom-toolbar.html',
  styleUrl: './bottom-toolbar.scss',
})
export class BottomToolbarComponent {
  private readonly supabaseService = inject(SupabaseService);
  private readonly appStore = inject(AppStore);
  private readonly router = inject(Router);
  protected user: WritableSignal<{ username: string | null; avatar_url: string | null } | null> = signal(null);
  navigationMenu = [
    { label: 'Home', icon: 'home', route: '/dashboard' },
    { label: 'Calendar', icon: 'calendar_month', route: '/calendar' },
    { label: 'Workouts', icon: 'fitness_center', route: '/workout' },
  ];

  constructor() {
    effect(async () => {
      const session = this.appStore.session();
      if (session?.user) {
        const { data, error } = await this.supabaseService.profile(session.user);
        if (error) {
          console.error('Error fetching profile:', error);
          this.user.set(null);
        } else {
          this.user.set({ username: data.username, avatar_url: data.avatar_url });
        }
      } else {
        this.user.set(null);
      }
    });
  }

  async signOut() {
    await this.supabaseService.signOut();
    this.router.navigate(['/auth']);
  }

  navigateToUrl(url: string) {
    this.router.navigate([url]);
  }
}
