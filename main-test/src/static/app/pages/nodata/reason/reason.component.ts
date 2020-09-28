import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';

@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html'
})
export class ReasonComponent implements OnInit {

  errorFields: any[] = [];
  errorsList: any[] = [];
  pageText: any;
  reasonsList: any;
  reasonForm: FormGroup;

  protected prevPage = '';

  constructor(
        protected utils: Utils,
        protected service: DmrServices,
        protected message: MessageService,
        protected errorHandler: MyDeqErrorHandler,
        protected formBuilder: FormBuilder) {
            this.pageText = this.message.getReasonPageText();
            this.reasonForm = this.formBuilder.group({
                 selectedReasonId: new FormControl(null),
                 selectedReasonComment: new FormControl(null)
            });
    }

  ngOnInit() {
    this.service.getReasonList().subscribe(
      response => {
          this.reasonsList = response.noDataReasonList;
          this.reasonForm.reset({selectedReasonId: response.selectedReasonId, selectedReasonComment: response.selectedReasonComment})
          this.prevPage = response.previous_page;
      },
      error => {
          this.errorsList = this.errorHandler.getErrors(error);
      }, () => {

    });
  }

  goBack() {
      this.utils.navigateTo(this.prevPage, true, true);
  }

  continue(form) {
    this.errorFields = [];
    this.errorsList = [];
    this.service.updateNoDataReason(form).subscribe(
        response => {
            this.utils.navigateTo(response.next_page, true, true);
        },
        error => {
            this.errorsList = this.errorHandler.getErrors(error);
            this.errorFields = this.errorHandler.getErrorFields(error);
        });
  }

}
