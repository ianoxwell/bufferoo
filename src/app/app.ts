import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './common/auth.service';
import { BottomToolbarComponent } from './components/bottom-toolbar/bottom-toolbar';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { protectedRoutes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomToolbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('bufferoo');
  protected showToolbar = signal(false);

  constructor(private router: Router, private authService: AuthService) {}

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
