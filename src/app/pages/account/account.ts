import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { SupabaseService } from '@app/supabase.service';
import { IProfile } from '@models/user.model';

@Component({
  selector: 'app-account',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  loading = false;
  profile!: IProfile;
  updateProfileForm: FormGroup;
  router = inject(Router);

  constructor(private supabaseService: SupabaseService) {
    this.updateProfileForm = this.createForm();
  }

  async ngOnInit() {
    await this.getProfile();
    const { username, website, avatar_url } = this.profile;
    this.updateProfileForm.patchValue({
      username,
      website,
      avatar_url,
    });
  }

  createForm() {
    return new FormGroup({
      username: new FormControl('', []),
      website: new FormControl('', []),
      avatar_url: new FormControl('', []),
    });
  }

  async getProfile() {
    try {
      this.loading = true;
      const session = this.supabaseService.session();
      if (!session?.user) {
        throw new Error('User not logged in');
      }
      const { data: profile, error, status } = await this.supabaseService.profile(session.user);
      if (error && status !== 406) {
        throw error;
      }
      if (profile) {
        this.profile = profile;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading = true;
      const session = this.supabaseService.session();
      if (!session?.user) {
        throw new Error('User not logged in');
      }
      const username = this.updateProfileForm.value.username as string;
      const website = this.updateProfileForm.value.website as string;
      const avatar_url = this.updateProfileForm.value.avatar_url as string;
      const { error } = await this.supabaseService.updateProfile({
        id: session.user.id,
        username,
        website,
        avatar_url,
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  async signOut() {
    await this.supabaseService.signOut();
    this.router.navigate(['/auth']);
  }
}

