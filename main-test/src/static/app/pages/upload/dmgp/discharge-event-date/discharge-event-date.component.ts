import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { DmrServices } from '../../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../../shared/errorHandler';

import { Utils } from '../../../../shared/Utils';
import * as _ from 'lodash';
import { MydeqAlertModalComponent } from '../../../../shared/modals/alert-modal/alert.component';

@Component({
  selector: 'discharge-event-date',
  templateUrl: './discharge-event-date.component.html'
})
export class DischargeEventDateComponent implements OnInit {

  @ViewChild(MydeqAlertModalComponent, { static: true }) myAlertModal: MydeqAlertModalComponent;
  error_fields: any[] = [];
  errorsList: any[] = [];
  dischargeEventDateForm: FormGroup;
  prevPage = '';
  nextPage = '';
  model: any = {};
  showEventSection = false;

  currentDate: any;
  maxDate: any;

  constructor(
    public utils: Utils,
    public route: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public service: DmrServices,
    public errorHandler: MyDeqErrorHandler
  ) {
    this.dischargeEventDateForm = this.formBuilder.group({
      outfallId: new FormControl('-1'),
      dischargeStartDate: new FormControl(null),
      dischargeEndDate: new FormControl(null)
    });
    this.calMinMaxDate();
  }

  ngOnInit() {
    this.service.getDischargeEventDate().subscribe(
      response => {
        this.model = response;
        this.prevPage = response.previous_page;
        if (response.dischargeEvent) {
          this.dischargeEventDateForm.reset({
            outfallId: response.dischargeEvent.outfallId,
            dischargeStartDate: this.utils.convertStringToDate(response.dischargeEvent.dischargeStartDate),
            dischargeEndDate: this.utils.convertStringToDate(response.dischargeEvent.dischargeEndDate)
          });
        }
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.error_fields = this.errorHandler.getErrorFields(error);
      });
  }

  backClick() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  continue(form: any) {
    if (form.outfallId === '-1') {
      form.outfallId = '';
    }

    form.dischargeStartDate = this.utils.convertDateToString(form.dischargeStartDate);
    form.dischargeEndDate = this.utils.convertDateToString(form.dischargeEndDate);


    const submitData = {
      'dischargeEvent': form
    }
    this.service.putDischargeEventDate(submitData).subscribe(
      response => {
        this.utils.navigateTo(response.next_page, true, true);
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.error_fields = this.errorHandler.getErrorFields(error);
      });
  }

  private calMinMaxDate(): void {
    const todayDate = new Date();
    this.currentDate = { year: todayDate.getFullYear(), month: todayDate.getMonth() + 1, day: todayDate.getUTCDate() };
    // this.minDate = { year: 1900, month: 1, day: 1 }
    this.maxDate = { year: this.currentDate.year + 1, month: this.currentDate.month, day: this.currentDate.day };
  }

}
