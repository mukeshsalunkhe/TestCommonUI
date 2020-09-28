import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';
import { MydeqAlertModalComponent } from '../../../shared/modals/alert-modal/alert.component';

import { environment } from '../../../../environments/environment';

const contextPath = environment.contextPath;

@Component({
  selector: 'download-excel',
  templateUrl: './download-excel.component.html'
})

export class DownloadExcelComponent implements OnInit {

  @ViewChild(MydeqAlertModalComponent, { static: true }) myAlertModal: MydeqAlertModalComponent;
  errorFields: any[] = [];
  errorsList: any[] = [];
  model: any = {};
  alreadyDownloaded: boolean;
  ALERT: any = {
    title: 'ALERT',
    msg: 'You must download your spreadsheet before continue with the process of uploading a DMR spreadsheet.',
    mainButtonText: 'OK',
    leftButtonText: 'RETURN TO mySTUFF',
    leftButtonCTA: '/mydeq/dashboard'
  }

  protected prevPage = '';

  constructor(
    protected utils: Utils,
    protected service: DmrServices,
    protected message: MessageService,
    protected errorHandler: MyDeqErrorHandler,
    protected formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.service.getDownloadPage().subscribe(
      response => {
        this.prevPage = response.previous_page;
        this.model = {
          generatedDate: response.generatedDate,
          wetSeasonName: response.wetSeasonName,
          wetSeasonStartDt: response.wetSeasonStartDt,
          wetSeasonEndDt: response.wetSeasonEndDt
        }
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.errorFields = this.errorHandler.getErrorFields(error);
      });
  }

  continue(navigateNextPage = true) {
    if (!this.alreadyDownloaded) {
      this.myAlertModal.showErrorMessage(this.ALERT);
      return;
    }
    this.service.putDownloadPage({}).subscribe(
      response => {
        if (navigateNextPage) {
          this.utils.navigateTo(response.next_page, true, true);
        }
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.errorFields = this.errorHandler.getErrorFields(error);
      });
  }

  goBack() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  getReport() {
    this.alreadyDownloaded = true;
    window.open(contextPath + '/service/' + this.utils.module + '/download/downloadExcel', '_blank');
    this.continue(false);
  }

  setAlreadyDownloaded(isDownloaded: boolean) {
    this.alreadyDownloaded = isDownloaded;
  }

}
