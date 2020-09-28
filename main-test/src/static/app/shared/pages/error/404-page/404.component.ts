import { Component } from '@angular/core';

import { Utils } from '../../../../shared/Utils';

@Component({
  selector: 'page-not-found',
  templateUrl: './404.component.html'
})

export class PageNotFoundComponent {

  constructor(
    private utils: Utils,
  ) {
    utils.title = 'PAGE NOT FOUND'
  }

  goBack(){
     window.location.href=window.location.origin+"/mydeq/dashboard";
  }

}
