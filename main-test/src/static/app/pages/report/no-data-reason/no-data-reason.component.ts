import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';

@Component({
  selector: 'app-reason',
  templateUrl: './no-data-reason.component.html'
})
export class NoDataReasonComponent implements OnInit {

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
      nodiIdNo: new FormControl(null),
      comments: new FormControl(null)
    });
  }

  ngOnInit() {
    this.service.getNoDataReason().subscribe(
      response => {
        this.reasonsList = response.noDiCodesList;
        if (response.noDataReason) {
          this.reasonForm.reset({
            nodiIdNo: response.noDataReason.nodiIdNo,
            comments: response.noDataReason.comments
          });
        }
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

  continue(form, navigateNextPage = true) {
    const request = {
      noDataReason: form
    };
    this.errorFields = [];
    this.errorsList = [];
    this.service.putNoDataReason(request).subscribe(
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

  disableForm(disabled: boolean) {
    if (disabled) {
      this.reasonForm.disable();
    } else {
      this.reasonForm.enable();
      this.continue(this.reasonForm.getRawValue(), false);
    }
  }

}
