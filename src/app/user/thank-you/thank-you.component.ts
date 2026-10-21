import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-thank-you',
    templateUrl: './thank-you.component.html',
    styleUrls: ['./thank-you.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ThankYouComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
