import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
