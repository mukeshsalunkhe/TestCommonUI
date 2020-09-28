import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MydeqAlertModalComponent } from '../../../../shared/modals/alert-modal/alert.component';
import { MyDeqErrorHandler } from '../../../../shared/errorHandler';
import { DmrServices } from '../../../../services/dmr/dmr.service';
import { Utils } from '../../../../shared/Utils';
import * as _ from 'lodash';

@Component({
  selector: 'no_data_q',
  templateUrl: './no_data_q.component.html'
})

export class NoDataReasonQuestionComponent implements OnInit {

  errorsFields: any[] = [];
  errorsList: any[] = [];
  protected nextPage = '';
  protected prevPage = '';
  nodataReasonQForm: FormGroup;
  noDataReasons: any[] = [];
  headerText = '';

  @ViewChild(MydeqAlertModalComponent, { static: false }) myAlertModal: MydeqAlertModalComponent;
  
  constructor(
    public utils: Utils,
    protected route: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected service: DmrServices,
    protected errorHandler: MyDeqErrorHandler) {
    this.nodataReasonQForm = formBuilder.group({
      booleanAnswer: new FormControl(null),
      userNodiCode: new FormControl(null),
      comments: new FormControl(null)
    });

    this.headerText = 'Did you have any discharge events that met the thresholds for DMGP reporting requirements?';

  }

  ngOnInit() {
    this.service.getNodiReasonQuestion().subscribe(
      response => {
        this.nodataReasonQForm.reset({ 
          booleanAnswer: response.booleanAnswer,
          userNodiCode: response.userNodiCode,
          comments: response.comments
        });
        this.noDataReasons = response.noDataReasons;
        this.prevPage = response.previous_page;
        this.nextPage = response.next_page;
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.errorsFields = this.errorHandler.getErrorFields(error);
      });
  }

  continueClick(form) {
    this.errorsFields = [];
    this.errorsList = [];
    if (form.booleanAnswer === 'Y') {
      this.myAlertModal.showErrorMessage({
        title: 'ALERT: NO EVENT LOGGED IN',
        msg: 'You do not have any event activity, please create and save event details with logging correct monitoring parameter information and then visit this page to submit DMR.',
        mainButtonText: 'RETURN TO mySTUFF',
        mainButtonCTA: '/mydeq/dashboard'
      });

    } else {
      this.service.putNodiReasonQuestion(form).subscribe(
        response => {
          this.utils.navigateTo(response.next_page, true, true);
        },
        error => {
          this.errorsList = this.errorHandler.getErrors(error);
          this.errorsFields = this.errorHandler.getErrorFields(error);
        });
    }
  }

  goBack() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  resetSubReasonForm() {
    this.nodataReasonQForm.get('comments').reset();
  }

  doYouHaveData(userSelected) {
    if (userSelected === 'Y') {
      this.resetSubReasonForm();
      this.nodataReasonQForm.get('userNodiCode').reset();
    }
  }
}
