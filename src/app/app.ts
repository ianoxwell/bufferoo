import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { protectedRoutes } from './app.routes';
import { BottomToolbarComponent } from './components/bottom-toolbar/bottom-toolbar';
import { AuthService } from '@core/auth.service';
import { HeaderComponent } from "./components/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomToolbarComponent, CommonModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  protected showToolbar = signal(false);

  ngOnInit() {
    this.routerEvents().subscribe();
    this.authService.initializeAuth();
  }

  routerEvents() {
    return this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        // check the current URL and strip any leading slash
        const url = event.urlAfterRedirects.startsWith('/')
          ? event.urlAfterRedirects.slice(1)
          : event.urlAfterRedirects;
        this.showToolbar.set(protectedRoutes.some((route) => url.startsWith(route)));
        return url;
      })
    );
  }
}
