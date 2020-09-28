import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Utils } from '../../../shared/Utils';
import { MydeqAlertModalComponent } from '../../../shared/modals/alert-modal/alert.component';

import { environment } from '../../../../environments/environment';

const contextPath = environment.contextPath;

@Component({
  selector: 'app-error-report',
  templateUrl: './error-report.component.html'
})

export class ErrorReportComponent implements OnInit {

  @ViewChild(MydeqAlertModalComponent, { static: true }) myAlertModal: MydeqAlertModalComponent;
  errorFields: any[] = [];
  errorsList: any[] = [];

  errorReportForm: FormGroup;
  model: any = {};

  ALERT: any = {
    title: 'ALERT',
    msg: 'You are attempting to continue with the process of uploading a DMR spreadsheet that is incomplete or contains critical errors. You must complete your spreadsheet or fix critical errors to be able to continue.',
    mainButtonText: 'OK',
    leftButtonText: 'RETURN TO mySTUFF',
    leftButtonCTA: '/mydeq/dashboard'
  }

  protected prevPage = '';

  constructor(
    public utils: Utils,
    protected formBuilder: FormBuilder
  ) {
    this.errorReportForm = this.formBuilder.group({
      reupload: new FormControl(null)
    });
  }

  ngOnInit() {

  }

  continue(form) {
    if (!form || !form.reupload) {
      this.myAlertModal.showErrorMessage(this.ALERT);
    }

    if (form.reupload === 'N') {
      this.utils.gotoDashboard();
    } else {
      this.goBack();
    }

  }

  goBack() {
    if (this.utils.module === 'msgp_19' || this.utils.module === 'cgp20') {
      this.utils.navigateTo('upload', true, true);
    } else {
      this.utils.navigateTo('upload_spreadsheet', true, true);
    }
  }

  getErrorReport() {
    if (this.utils.module === 'msgp_19' || this.utils.module === 'cgp20') {
      window.open(contextPath + '/service/' + this.utils.module + '/download/error_report', '_blank');
    } else {
      window.open(contextPath + '/service/' + this.utils.module + '/' + this.utils.path + '/error_report', '_blank');
    }
  }

}
