import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../../shared/errorHandler';
import { DmrServices } from '../../../../services/dmr/dmr.service';
import { MessageService } from '../../../../message-bundle/message.service';
import { Utils } from '../../../../shared/Utils';

@Component({
  selector: 'dmgp-summary',
  templateUrl: './dmgp-summary.component.html'
})
export class DmgpSummaryComponent implements OnInit {

  errorsList: any[] = [];
  protected prevPage = '';
  pageText: any;
  reportingPeriod: any = {};
  noDataReason: any = {};
  savedEventList: any = [{}];
  showSavedEventSection = false;
  showNoDataDmrSection = false;
  showNoDataDmrQuestion = false;
  constructor(
    public utils: Utils,
    protected service: DmrServices,
    protected message: MessageService,
    protected errorHandler: MyDeqErrorHandler
  ) { }

  ngOnInit() {
    this.service.loadSummary().subscribe(
      response => {
        if (response && response.answeredPageMap) {
          if (response.answeredPageMap.DISCHARGE_EVENTS_SAVED_LIST) {
            this.savedEventList = response.answeredPageMap.DISCHARGE_EVENTS_SAVED_LIST.selectedEventList;
            this.showSavedEventSection = true;
          }
           if (response.answeredPageMap.NO_DATA_Q) {
            this.noDataReason = response.answeredPageMap.NO_DATA_Q;
            this.showNoDataDmrQuestion = true;
            if (this.noDataReason.booleanAnswer == 'N') {
                this.showNoDataDmrSection = true;
                this.noDataReason.booleanAnswer = 'No';
            } else {
              this.noDataReason.booleanAnswer = 'Yes';
            }
          }
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

  viewDischargeEventnDetails(eventId) {
        this.utils.navigateTo('/edit_monitoring_info/summary/' + eventId, true, true);
    }
    isEvenRow(index: number) {
        return (index % 2) === 0;
    }

}
