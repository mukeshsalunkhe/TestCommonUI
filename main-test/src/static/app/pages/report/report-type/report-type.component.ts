import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';


@Component({
  selector: 'app-report-type',
  templateUrl: './report-type.component.html'
})

export class ReportTypeComponent implements OnInit {

  errorsList: any[] = [];
  errorFields: any[] = [];
  protected prevPage = '';
  pageForm: FormGroup;

  constructor(
    public utils: Utils,
    protected service: DmrServices,
    protected message: MessageService,
    protected errorHandler: MyDeqErrorHandler,
    protected formBuilder: FormBuilder,
    protected activatedRoute: ActivatedRoute) {

    this.pageForm = this.formBuilder.group({
      dmrType: new FormControl(null),
    });
  }

  ngOnInit() {
    let placeID: string;
    let ltfID: string;
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      placeID = params['placeId'];
      ltfID = params['permitId'];
      if (!ltfID) {
        return;
      }

      this.service.getReportType(placeID, ltfID).subscribe(
        response => {
          this.prevPage = response.previous_page;
        },
        error => {
          this.errorsList = this.errorHandler.getErrors(error);
          this.errorFields = this.errorHandler.getErrorFields(error);
        });
    });
  }

  goBack() {
    this.utils.navigateTo('inventory', false, true);
  }

  continue(form, navigateNextPage = true) {
    this.service.putReportType(form).subscribe(
      response => {
        this.utils.path = this.getPath(form.dmrType);
        if (navigateNextPage) {
          this.utils.navigateTo(response.next_page, true, true);
        }
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
      });
  }

  getPath(dmrType: string): string {
    return dmrType.toLowerCase();
  }

  disableForm(disabled: boolean) {
    if (disabled) {
      this.pageForm.disable();
    } else {
      this.pageForm.enable();
      this.continue(this.pageForm.getRawValue(), false);
    }
  }
}
