import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { BusinessProfileService } from '../../services/business-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  bpForm!: FormGroup;
  saving = signal(false);
  savingBp = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  bpSuccessMsg = signal('');
  bpErrorMsg = signal('');
  editing = signal(false);
  editingBp = signal(false);

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private userService: UserService,
    private bpService: BusinessProfileService,
    public router: Router
  ) {}

  ngOnInit() {
    const u = this.auth.currentUser();
    this.form = this.fb.group({
      name:  [u?.name  || '', Validators.required],
      email: [u?.email || '', [Validators.required, Validators.email]],
      phone: [u?.phone || '', Validators.pattern(/^\+?[0-9]{7,15}$/)]
    });
    this.bpForm = this.fb.group({
      seller_type:   [''],  // read-only, populated from API, not editable here
      business_name: ['', Validators.required],
      address:       ['', Validators.required]
    });

    if (this.isSeller) {
      this.bpService.getProfile().subscribe({
        next: bp => { if (bp) this.bpForm.patchValue(bp); }
      });
    }
  }

  onSave() {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');

    this.userService.updateProfile(this.form.value).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.successMsg.set('Profile updated successfully');
      },
      error: err => {
        this.saving.set(false);
        this.errorMsg.set(err.error?.message || 'Update failed');
      }
    });
  }

  onSaveBp() {
    if (this.bpForm.invalid) return;
    this.savingBp.set(true);
    this.bpSuccessMsg.set('');
    this.bpErrorMsg.set('');

    this.bpService.saveProfile(this.bpForm.value).subscribe({
      next: () => {
        this.savingBp.set(false);
        this.editingBp.set(false);
        this.bpSuccessMsg.set('Business profile updated');
      },
      error: err => {
        this.savingBp.set(false);
        this.bpErrorMsg.set(err.error?.message || 'Update failed');
      }
    });
  }

  get isSeller() { return this.auth.currentUser()?.is_seller; }
  get isAdmin()  { return this.auth.currentUser()?.role === 'admin'; }

  get businessNameLabel() {
    return this.bpForm.get('seller_type')?.value === 'restaurant'
      ? 'Restaurant Name' : 'Brand Name';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
