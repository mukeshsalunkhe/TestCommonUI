import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';

import { environment } from '../../../../environments/environment';

const contextPath = environment.contextPath;

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html'
})
export class SharedConfirmationPageComponent implements OnInit {

  errorsFields: any[] = [];
  errorsList: any[] = [];
  pageText: any = {};
  model: any = {};

  constructor(
    public utils: Utils,
    protected router: Router,
    protected errorHandler: MyDeqErrorHandler,
    protected service: DmrServices,
    protected message: MessageService,
  ) {
    utils.isConfirmationPage = true;
    this.utils.placeName = null;
    this.utils.placeAddress = null;
    this.pageText = this.message.getConfirmationText();
    utils.title = 'CONFIRMATION';
    document.getElementsByTagName('body')[0].className = 'confirmation';
  }


  ngOnInit() {
    this.service.getConfirmationDetails().subscribe(
      response => {
        this.model = response.dmrConfirmation;
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
      });
  }

  downloadDoc = () => {
    let url = contextPath + '/service/';
    if (this.utils.module !== 'msgp_19' && this.utils.module !== 'cgp20') {
      url += this.utils.module + '/';
    }
    url += this.utils.path + '/download/confirmation';

    if (this.utils.module === 'msgp_19' || this.utils.module ==='cgp20') {
      url += 'Doc'
    }

    window.open(url, '_blank');
  }

  exitClick = () => {
    this.utils.gotoDashboard();
  }
}
