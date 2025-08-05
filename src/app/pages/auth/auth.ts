import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-auth',
  imports: [MatInputModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth implements OnInit {
  signInForm: FormGroup;
  loading = false;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly appStore: AppStore,
    private readonly router: Router
  ) {
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
      alert('Check your email for the login link!');
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
