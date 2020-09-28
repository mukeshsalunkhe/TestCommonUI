import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { DmrServices } from '../../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../../shared/errorHandler';

import { Utils } from '../../../../shared/Utils';
import * as _ from 'lodash';
import { MydeqAlertModalComponent } from '../../../../shared/modals/alert-modal/alert.component';

@Component({
    selector: 'ms4-summary',
    templateUrl: './ms4-summary.component.html'
})
export class Ms4SummaryComponent implements OnInit {

    @ViewChild(MydeqAlertModalComponent, {static: false}) myAlertModal: MydeqAlertModalComponent;
    error_fields: any[] = [];
    errorsList: any[] = [];
    logMonitoringQuestionForm: FormGroup;
    prevPage = '';
    nextPage = '';
    model: any = {};
    booleanAnswer = '';
    logMonitoringType = '';
    showSubQuestion = false;
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
            booleanAnswer: [''],
            logMonitoringType: ['']
        });

    }

    ngOnInit() {
        this.onMonitListLoad();
    }

    onMonitListLoad() {
        this.service.loadSummary().subscribe(
            response => {
                this.model = response;
                this.prevPage = response.previous_page;
                this.booleanAnswer = response.booleanAnswer;
                this.logMonitoringType = response.logMonitoringType;
                this.showHideSubQuestion(this.booleanAnswer);
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

    showHideSubQuestion(booleanAnswer: string) {
        if (booleanAnswer == 'Y') {
            this.showSubQuestion = true;
        } else {
            this.showSubQuestion = false;
        }
    }

    goBack() {
        // window.location.href = '/mydeq/dashboard';
        this.utils.navigateTo(this.prevPage, true, true);
    }

    continue(form) {
        this.error_fields = [];
        this.errorsList = [];
        this.service.putSummary().subscribe(
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

    deleteOutfallSampleDetails(userSelection: string, outfallMonitId: string, sampleMonitType: string) {
        if (userSelection === 'Y') {
            this.service.deleteOutfallSampleMs4List(outfallMonitId, sampleMonitType).subscribe(
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
        if (monitSamplingType == 'VDM') {
            this.utils.navigateTo('/ms4_log_visual_monitoring/ms4_summary/' + monitSamplingType + '/' + outfallMonitId, true, true);
        } else {
            this.utils.navigateTo('/ms4_log_analytical_monitoring/ms4_summary/' + monitSamplingType + '/' + outfallMonitId, true, true);
        }

    }

    isEvenRow(index: number) {
        return (index % 2) === 0;
    }

}
