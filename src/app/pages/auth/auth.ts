import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { SupabaseService } from '@core/supabase.service';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-auth',
  imports: [MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  private readonly appStore = inject(AppStore);
  private readonly router = inject(Router);
  hasSignedIn = signal(false);
  signInForm: FormGroup;
  loading = false;

  constructor() {
    this.signInForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.appStore.session()) {
      this.router.navigate(['/dashboard']);
    }
  }

  createForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  async onSubmit(): Promise<void> {
    if (this.signInForm.invalid || this.loading) {
      return;
    }

    try {
      this.loading = true;
      const email = this.signInForm.getRawValue().email;
      const { error } = await this.supabaseService.signIn(email);
      if (error) throw error;
      this.hasSignedIn.set(true);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.signInForm.reset();
      this.loading = false;
    }
  }
}
