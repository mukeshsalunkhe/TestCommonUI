import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class SharedSummaryComponent implements OnInit {

  errorsList: any[] = [];
  protected prevPage = '';
  pageText: any;
  reportingPeriod: any = {};
  noDataReason: any = {};

  constructor (
    public utils: Utils,
    protected service: DmrServices,
    protected message: MessageService,
    protected errorHandler: MyDeqErrorHandler
  ) { }

  ngOnInit() {
    this.service.loadSummary().subscribe(
      response => {
        if (response && response.answeredPageMap) {
          this.reportingPeriod = response.answeredPageMap.REPORTING_PERIOD;
          this.noDataReason = response.answeredPageMap.NO_DATA_REASON;
        }
        this.prevPage = response.previous_page;
      },
      error => {
          this.errorsList = this.errorHandler.getErrors(error);
    });
  }

  goBack() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  continue() {
    this.service.putSummary().subscribe(
      response => {
          this.utils.navigateTo(response.next_page, true, true);
      },
      error => {
          this.errorsList = this.errorHandler.getErrors(error);
    });
  }

  editDetails = (pageName: string) => {
    this.utils.navigateTo(pageName, true, true);
  }

}
