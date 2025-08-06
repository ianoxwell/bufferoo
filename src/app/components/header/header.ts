import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit {
  taglines = [
    'Train Smarter. Track Like a Roo.',
    'Built to Bounce Back Stronger.',
    'Your Workout, Tracked the Aussie Way.',
    'Power Your Progress.',
    'Where Grit Meets Gains.',
  ];
  
  tagline = this.taglines[0];

  ngOnInit(): void {
    // You can add any initialization logic here
    this.tagline = this.taglines[Math.floor(Math.random() * this.taglines.length)];
  }
}
