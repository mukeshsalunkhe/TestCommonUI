import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { Utils } from '../../../shared/Utils';
import { LogoutService } from '../../../services/logout.service';

@Component({
  selector: 'app-certify-page',
  templateUrl: './certify-page.component.html'
})
export class SharedCertifyPageComponent implements OnInit {

  errorsFields: any[] = [];
  errorsList: any[] = [];
  certifyForm: FormGroup;
  accLock = false;
  certifyText: string;
  challengeQuestion: any;
  ars = { header: '', bodyCopy: '' };
  nextPage = '';
  previousPage = '';
  chkClarifyStatement: boolean;
  finalSubmission = true;

  constructor(
    protected formBuilder: FormBuilder,
    protected utils: Utils,
    protected errorHandler: MyDeqErrorHandler,
    protected service: DmrServices,
    protected route: ActivatedRoute,
    protected router: Router,
    private logoutService: LogoutService
  ) {
    this.certifyForm = this.formBuilder.group({
      answer: new FormControl(null),
      certify: new FormControl(null)
    });
  }

  ngOnInit() {
    this.service.getCertifyPage().subscribe(
      response => {
        this.challengeQuestion = response.challengeQuestion;
        if (response.message) {
          response.message.forEach((certifyText) => {
            if (this.utils.regexCompare(certifyText.heading, '(Certify)')) {
              this.certifyText = certifyText.text;
            } else {
              this.ars.header = certifyText.heading;
              this.ars.bodyCopy = certifyText.text;
            }
          });
        }
        this.nextPage = response.next_page;
        this.previousPage = response.previous_page;
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.errorsFields = this.errorHandler.getErrorFields(error);
      });
  }

  continueClick(form: any) {
    this.errorsFields = [];
    this.errorsList = [];
    const request = { chkClarifyStatement: form.certify, challengeQuestion: { question: "", questionSetId: "", answer: "" } };
    request.challengeQuestion.question = this.challengeQuestion.question;
    request.challengeQuestion.questionSetId = this.challengeQuestion.questionSetId;
    request.challengeQuestion.answer = form.answer;
    this.service
      .putCertifyPage(request)
      .subscribe(
        receivedResponse => {
          if (receivedResponse.next_page) {
            const page = receivedResponse.next_page;
            if (page && page !== 'ALERT') {
              this.router.navigate([this.utils.module + '/' + this.utils.path + '/' + page.toLowerCase()], this.utils.navigationExtras);
            }
          } else {
            this.router.navigate([this.utils.module + '/' + this.utils.path + '/' + this.nextPage.toLowerCase()], this.utils.navigationExtras);
          }
        },
        error => {
          if (error.noOfAttempt === 5) {
            this.accLock = true;
            return;
          }
          this.challengeQuestion = (error && error.challengeQuestion) ? error.challengeQuestion : this.challengeQuestion;
          this.errorsList = this.errorHandler.getErrors(error);
          this.errorsFields = this.errorHandler.getErrorFields(error)
        });
  }

  backClick() {
    this.router.navigate([this.utils.module + '/' + this.utils.path + '/' + this.previousPage.toLowerCase()], this.utils.navigationExtras);
  }

  closeMe() {
    this.finalSubmission = false;
  }

  exitUser = () => {
    this.logoutService.logoutMe();
  }

}
