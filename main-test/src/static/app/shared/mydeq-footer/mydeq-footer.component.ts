import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mydeq-footer',
  templateUrl: './mydeq-footer.component.html',
  styles: [
  `
   .footer-nav {
      border-top: 4px solid #5c8885;
      margin-top: 20px !important;
      border-bottom: 0;
    }

    .footer-nav a {
      color: #604543;
    }

    .footer-nav  a:focus, .footer-nav a:hover {
      color: #5c8885;
    }

  ` ],
})
export class MydeqFooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
