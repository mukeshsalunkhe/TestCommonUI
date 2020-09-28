import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';
import { MydeqAlertModalComponent } from '../../../shared/modals/alert-modal/alert.component';

@Component({
    selector: 'app-reporting-period',
    templateUrl: './reporting-period.component.html'
})
export class SharedReportingPeriodComponent implements OnInit {


    @ViewChild(MydeqAlertModalComponent, {static: true}) myAlertModal: MydeqAlertModalComponent;
    errorFields: any[] = [];
    errorsList: any[] = [];
    protected prevPage = '';
    pageText: any = { table_column: { progress: true, status: true } };
    reportingPeriod: any;
    reportingPeriodForm: FormGroup;
    currentDate = new Date;

    constructor(
        public utils: Utils,
        protected service: DmrServices,
        protected message: MessageService,
        protected errorHandler: MyDeqErrorHandler,
        protected formBuilder: FormBuilder) {
        this.pageText = this.message.getReportingPeriodText();
        this.reportingPeriodForm = this.formBuilder.group({
            selectedCycleId: new FormControl(null),
        });
    }

    ngOnInit() {
        this.errorFields = [];
        this.errorsList = [];
        this.service.getReportingPeriod().subscribe(
            response => {
                this.reportingPeriod = response.reportingPeriods;
                this.prevPage = response.previous_page;
                this.reportingPeriodForm.reset({ selectedCycleId: response.selectedCycleId })
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
            });
    }

    goBack() {
        this.utils.navigateTo(this.prevPage, true, true);
    }

    continue(form) {
        this.errorFields = [];
        this.errorsList = [];
        this.service.putReportingPeriod(form).subscribe(
            response => {
                if (response.next_page === 'ALERT') {
                    if (response.alert_message === 'SUBMIT_BEFORE_END_DATE') {
                        this.myAlertModal.showErrorMessage(this.utils.ALERT.SUBMIT_BEFORE_END_DATE);
                    } else if (response.alert_message === 'INVALID_MS4_SUBMIT') {
                        this.myAlertModal.showErrorMessage(this.utils.ALERT.SUBMIT_MS4);
                    } else {
                        this.myAlertModal.showErrorMessage(this.utils.ALERT.REPORT_NOT_UPLOADED);
                    }
                } else {
                    this.utils.navigateTo(response.next_page, true, true);
                }
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.errorFields = this.errorHandler.getErrorFields(error);
            });
    }

    selectReportingPeriod(id, isSubmitted) {
        if (isSubmitted === this.utils.REPORTING_PERIOD_STATUS_CODE.SUBMITTED) {
            return;
        }
        this.reportingPeriodForm.reset({ selectedCycleId: id })
    }

}
