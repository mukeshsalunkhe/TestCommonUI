import { Component } from '@angular/core';

@Component({
  selector: 'error',
  templateUrl: './500.component.html'
})

export class ErrorPageComponent {

  constructor() { }

  goBack(){
     window.location.href=window.location.origin+"/mydeq/dashboard";
  }
}
