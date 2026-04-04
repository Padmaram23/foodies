import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerTypePickerComponent } from '../seller-type-picker/seller-type-picker';

@Component({
  selector: 'app-become-seller',
  standalone: true,
  imports: [SellerTypePickerComponent],
  templateUrl: './become-seller.html',
  styleUrl: './become-seller.scss'
})
export class BecomeSellerComponent {
  private returnUrl: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/sell';
  }

  onRegistered() { this.router.navigate([this.returnUrl]); }
  onCancelled()  { this.router.navigate([this.returnUrl]); }
}
