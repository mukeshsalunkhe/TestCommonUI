import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { DmrServices } from '../../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../../shared/errorHandler';

import { Utils } from '../../../../shared/Utils';
import * as _ from 'lodash';
import { MydeqAlertModalComponent } from '../../../../shared/modals/alert-modal/alert.component';

@Component({
  selector: 'log-monitoring-question',
  templateUrl: './log-monitoring-question.component.html'
})
export class LogMonitoringQuestionComponent implements OnInit {

  @ViewChild(MydeqAlertModalComponent, { static: false }) myAlertModal: MydeqAlertModalComponent;
  error_fields: any[] = [];
  errorsList: any[] = [];
  logMonitoringQuestionForm: FormGroup;
  prevPage = '';
  nextPage = '';
  model: any = {};
  showListing = false;

  constructor(
    public utils: Utils,
    public route: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public service: DmrServices,
    public errorHandler: MyDeqErrorHandler

  ) {
    this.logMonitoringQuestionForm = this.formBuilder.group({
      booleanAnswer: new FormControl(),
      logMonitoringType: new FormControl()
    });

  }

  ngOnInit() {
    this.onMonitListLoad();
  }

  onMonitListLoad() {
    this.service.getLogMonitoringQuestionDetails().subscribe(
      response => {
        this.model = response;
        this.prevPage = response.previous_page;
        this.logMonitoringQuestionForm.reset({
          booleanAnswer: response.booleanAnswer,
          logMonitoringType: response.logMonitoringType
        })
        if (response.outfallReportingDetailList && response.outfallReportingDetailList.length > 0) {
          this.showListing = true;
        }
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.error_fields = this.errorHandler.getErrorFields(error);
      }, () => {

      });


  }

  goBack() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  continue(form) {
    this.error_fields = [];
    this.errorsList = [];
    this.service.putLogMonitoringQuestionDetails(form).subscribe(
      response => {
        if (response.next_page === 'DASHBOARD') {
          window.location.href = '/mydeq/dashboard';
        } else {
          this.utils.navigateTo(response.next_page, true, true);
        }
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.error_fields = this.errorHandler.getErrorFields(error);
      });
  }

  deleteOutfallSampleDetails(userSelection: string, outfallMonitId: string, monitSamplingType: string) {
    if (userSelection === 'Y') {
      this.service.deleteOutfallSampleMs4List(outfallMonitId, monitSamplingType).subscribe(
        response => {
          this.onMonitListLoad();
        },
        error => {
          this.errorsList = this.errorHandler.getErrors(error);
          this.error_fields = this.errorHandler.getErrorFields(error);
        });
    }
    document.getElementById('deleteEventAppId_' + outfallMonitId).click();
  }

  viewOutfallSampleDataDetails(outfallMonitId: string, monitSamplingType: string) {
    if (monitSamplingType === 'VDM') {
      this.utils.navigateTo('/ms4_log_visual_monitoring/ms4_log_monitoring_q/' + monitSamplingType + '/' + outfallMonitId, true, true);
    } else {
      this.utils.navigateTo('/ms4_log_analytical_monitoring/ms4_log_monitoring_q/' + monitSamplingType + '/' + outfallMonitId, true, true);
    }

  }
}
