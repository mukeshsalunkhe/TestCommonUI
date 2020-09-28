import { Component } from '@angular/core';

@Component({
  selector: 'error',
  templateUrl: './invalid-request.component.html'
})

export class InvalidRequestComponent {

  constructor() { }

  goBack() {
    window.location.href = window.location.origin + '/mydeq/dashboard';
  }
}
