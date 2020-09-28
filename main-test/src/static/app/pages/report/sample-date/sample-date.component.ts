import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';
import { SAMPLE_DATE } from '../../../message-bundle/sample-date';
import { MydeqAlertModalComponent } from '../../../shared/modals/alert-modal/alert.component';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sample-date',
  templateUrl: './sample-date.component.html'
})
export class SampleDateComponent implements OnInit {
  @ViewChild(MydeqAlertModalComponent, { static: true }) myAlertModal: MydeqAlertModalComponent;

  error_fields: any[] = [];
  errorsList: any[] = [];
  pageForm: FormGroup;
  pageText: any;
  prevPage = '';
  nextPage = '';
  model: any = {};
  showEventSection = false;

  currentDate: any;
  maxDate: any;
  wetSeason: string;

  constructor(
    public utils: Utils,
    public route: ActivatedRoute,
    public router: Router,
    private message: MessageService,
    public formBuilder: FormBuilder,
    public service: DmrServices,
    public errorHandler: MyDeqErrorHandler
  ) {
    this.pageForm = this.formBuilder.group({
      sampleStartDate: new FormControl(null),
    });
    this.calMinMaxDate();
    this.pageText = message.getJSONObject(SAMPLE_DATE[utils.path]);
  }

  ngOnInit() {
    this.service.getSampleDate().subscribe(
      response => {
        this.prevPage = response.previous_page;
        this.pageForm.get('sampleStartDate').reset(this.utils.convertStringToDate(response.sampleStartDate));
        if (response.sampleStartDate) {
          this.showWetSeason(this.pageForm.get('sampleStartDate').value);
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

  continue(form: any, navigateNextPage = true) {
    form.sampleStartDate = this.utils.convertDateToString(form.sampleStartDate);
    this.service.putSampleDate(form).subscribe(response => {
      this.nextPage = response.next_page;
      if (response.alert_message) {
        this.myAlertModal.showCustomModal(response.alert_header, response.alert_message, 'CANCEL', 'PROCEED', this.navigate.bind(this));
      } else {
        if (navigateNextPage) {
          this.navigate();
        }
      }
    }, error => {
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

  navigate() {
    this.utils.path = this.nextPage === 'INVENTORY' ? undefined : this.utils.path;
    this.utils.navigateTo(this.nextPage, this.nextPage !== 'INVENTORY', true);
  }

  showWetSeason(date: NgbDate) {
    if (date && date.month > 5 && date.month < 11) {
      this.wetSeason = 'Summer Wet ' + date.year;
    } else if (date && date.month >= 0 && date.month < 5) {
      this.wetSeason = 'Winter Wet ' + (date.year - 1) + ' - ' + date.year;
    } else {
      this.wetSeason = 'Winter Wet ' + date.year + ' - ' + (date.year + 1);
    }
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
