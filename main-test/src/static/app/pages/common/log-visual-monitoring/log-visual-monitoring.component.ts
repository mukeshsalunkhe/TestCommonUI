import { ActivatedRoute, Router } from '@angular/router';
import { Component, Renderer, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { DmrServices } from '../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../shared/errorHandler';

import { Utils } from '../../../shared/Utils';
import * as _ from 'lodash';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'log-visual-monitoring',
    templateUrl: './log-visual-monitoring.component.html'
})
export class LogVisualMonitoringComponent implements OnInit {

    error_fields: any[] = [];
    errorsList: any[] = [];
    pageForm: FormGroup;
    protected prevPage = '';
    protected nextPage = '';
    model: any = {};
    logVisualMonitoringFormList: FormArray = new FormArray([]);
    logVisualMonitoringList: any[] = [];
    disableContinue = false;
    isOpen: boolean[] = [];
    // disableSave: boolean[] = [];
    fromPage = '';
    // showDelete = false;

    currentDate: any;
    maxDate: any;
    defaultOpnPanelIds: string[] = [];


    constructor(
        protected utils: Utils,
        protected route: ActivatedRoute,
        protected router: Router,
        protected formBuilder: FormBuilder,
        protected service: DmrServices,
        protected errorHandler: MyDeqErrorHandler,
        protected render: Renderer
    ) {
        this.pageForm = this.formBuilder.group({
            logVisualMonitoringFormList: this.logVisualMonitoringFormList,
            model: [''],
        });
        this.calMinMaxDate();
    }

    ngOnInit() {

        this.route.params
            .subscribe(params => {
                this.errorsList = [];
                this.error_fields = [];
                this.fromPage = params['fromPage'];
                this.service.getLogVisualMonitoring(params['fromPage'], params['samplingType'], params['outfallMonitId']).subscribe(
                    response => {
                        this.model = response;
                        this.prevPage = response.previous_page;
                        if (this.model.logVisualMonitoringList != null && this.model.logVisualMonitoringList.length > 0) {
                            for (let i = 0; i < this.model.logVisualMonitoringList.length; i++) {
                                this.addLogVisualMonitoringResult(this.model.logVisualMonitoringList[i]);
                                this.isOpen.push(false);
                            }
                            this.isOpen[this.model.logVisualMonitoringList.length - 1] = true;
                            this.disableContinue = false;
                          } else {
                            this.addMoreLogVisualMonitoring();
                            this.disableContinue = true;
                        }

                    },
                    error => {
                        this.errorsList = this.errorHandler.getErrors(error);
                        this.error_fields = this.errorHandler.getErrorFields(error);
                    }, () => {

                    });
            });

    }

    goBack() {
        if (this.fromPage) {
            this.utils.navigateTo(this.fromPage, true, true);
        } else {
            this.utils.navigateTo('ms4_log_monitoring_q', true, true);
        }
    }

    logVisualMonitoringLog(form: any, index: number) {

        this.errorsList = [];
        this.error_fields = [];
        form.sampleDate = this.utils.convertDateToString(form.sampleDate);

        this.service.putLogVisualMonitoring({
            'visualMonitoringSample': form,
            'index': index
        }).subscribe(
            response => {
                this.disableContinue = false;
                const logVisualMonitoringControl = <FormGroup>(<FormGroup>this.logVisualMonitoringFormList.at(index));
                logVisualMonitoringControl.get('seasonSampleId').disable();
                logVisualMonitoringControl.get('sampleDate').disable();
                logVisualMonitoringControl.get('sampleNodiCodeId').disable();
                logVisualMonitoringControl.get('sampleColorCodeId').disable();
                logVisualMonitoringControl.get('sampleSheenId').disable();
                logVisualMonitoringControl.get('sampleSolidId').disable();
                logVisualMonitoringControl.get('sampleFoamId').disable();
                logVisualMonitoringControl.get('sampleOdorId').disable();
                logVisualMonitoringControl.get('other').disable();
                // this.disableSave[index] = true;
                this.logVisualMonitoringFormList.at(index).get('sampleDischargeMonitId').reset(response.visualMonitoringSample.sampleDischargeMonitId);
                // Copying Name. Because it not sent in service/
                response.visualMonitoringSample.seasonSampleName = this.model.logVisualMonitoringList[index].seasonSampleName;
                this.model.logVisualMonitoringList[index] = response.visualMonitoringSample;
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
            });


    }

    onParameterSelect(index, sampleNodiCodeId) {
        const logVisualMonitoringControl = <FormGroup>(<FormGroup>this.logVisualMonitoringFormList.at(index));
        if (sampleNodiCodeId !== '-1') {
            logVisualMonitoringControl.get('sampleColorCodeId').setValue('-1');
            logVisualMonitoringControl.get('sampleSheenId').setValue('-1');
            logVisualMonitoringControl.get('sampleSolidId').setValue('-1');
            logVisualMonitoringControl.get('sampleFoamId').setValue('-1');
            logVisualMonitoringControl.get('sampleOdorId').setValue('-1');
            logVisualMonitoringControl.get('sampleColorCodeId').disable();
            logVisualMonitoringControl.get('sampleSheenId').disable();
            logVisualMonitoringControl.get('sampleSolidId').disable();
            logVisualMonitoringControl.get('sampleFoamId').disable();
            logVisualMonitoringControl.get('sampleOdorId').disable();
        } else {
            logVisualMonitoringControl.get('sampleColorCodeId').enable();
            logVisualMonitoringControl.get('sampleSheenId').enable();
            logVisualMonitoringControl.get('sampleSolidId').enable();
            logVisualMonitoringControl.get('sampleFoamId').enable();
            logVisualMonitoringControl.get('sampleOdorId').enable();
        }
    }
    enableEditLogMonit(index) {
        const logVisualMonitoringControl = this.logVisualMonitoringFormList.at(index) as FormGroup;
        logVisualMonitoringControl.get('seasonSampleId').enable();
        logVisualMonitoringControl.get('sampleDate').enable();
        logVisualMonitoringControl.get('sampleNodiCodeId').enable();
        if (this.model.logVisualMonitoringList[index].sampleNodiCodeId === '-1' || this.model.logVisualMonitoringList[index].sampleNodiCodeId === '-1') {
            logVisualMonitoringControl.get('sampleColorCodeId').enable();
            logVisualMonitoringControl.get('sampleSheenId').enable();
            logVisualMonitoringControl.get('sampleSolidId').enable();
            logVisualMonitoringControl.get('sampleFoamId').enable();
            logVisualMonitoringControl.get('sampleOdorId').enable();
        }
        logVisualMonitoringControl.controls['other'].enable();
        // this.disableSave[index] = false;
        this.disableContinue = true;
    }

    continue(form: any) {
        if (this.fromPage) {
            this.utils.navigateTo(this.fromPage, true, true);
        } else {
            this.utils.navigateTo('ms4_log_monitoring_q', true, true);
        }
    }

    addLogVisualMonitoringResult(logVisualMonitoring: any) {
        this.disableContinue = false;
        this.logVisualMonitoringFormList.push(new FormGroup({
            seasonSampleId: new FormControl({ value: logVisualMonitoring.seasonSampleId ? logVisualMonitoring.seasonSampleId : '-1', disabled: false }),
            seasonSampleName: new FormControl({ value: logVisualMonitoring.seasonSampleName ? logVisualMonitoring.seasonSampleName : null, disabled: false }),
            sampleDate: new FormControl({ value: this.utils.convertStringToDate(logVisualMonitoring.sampleDate), disabled: false }),
            sampleNodiCodeId: new FormControl({ value: logVisualMonitoring.sampleNodiCodeId ? logVisualMonitoring.sampleNodiCodeId : '-1', disabled: false }),
            sampleColorCodeId: new FormControl({ value: logVisualMonitoring.sampleColorCodeId ? logVisualMonitoring.sampleColorCodeId : '-1', disabled: false }),
            sampleSheenId: new FormControl({ value:  logVisualMonitoring.sampleSheenId ? logVisualMonitoring.sampleSheenId : '-1', disabled: false }),
            sampleSolidId: new FormControl({ value: logVisualMonitoring.sampleSolidId ? logVisualMonitoring.sampleSolidId : '-1', disabled: false }),
            sampleFoamId: new FormControl({ value: logVisualMonitoring.sampleFoamId ? logVisualMonitoring.sampleFoamId : '-1', disabled: false }),
            sampleOdorId: new FormControl({ value: logVisualMonitoring.sampleOdorId ? logVisualMonitoring.sampleOdorId : '-1', disabled: false }),
            other: new FormControl({ value: logVisualMonitoring.other ? logVisualMonitoring.other : null, disabled: false }),
            sampleDischargeMonitId: new FormControl({ value: logVisualMonitoring.sampleDischargeMonitId ? logVisualMonitoring.sampleDischargeMonitId : null, disabled: false }),
        }));
        const index = this.logVisualMonitoringFormList.length - 1;
        if (this.model.logVisualMonitoringList != null && this.model.logVisualMonitoringList[index]) {
            const selectedSampleDetail = _.find(this.model.seasonSampleList, { code: this.model.logVisualMonitoringList[index].seasonSampleId });
            this.model.logVisualMonitoringList[index].seasonSampleName = selectedSampleDetail.value;
            const logVisualMonitoringControl = <FormGroup>(<FormGroup>this.logVisualMonitoringFormList.at(index));
            logVisualMonitoringControl.controls['seasonSampleId'].disable();
            logVisualMonitoringControl.controls['sampleDate'].disable();
            logVisualMonitoringControl.controls['sampleNodiCodeId'].disable();
            logVisualMonitoringControl.controls['sampleColorCodeId'].disable();
            logVisualMonitoringControl.controls['sampleSheenId'].disable();
            logVisualMonitoringControl.controls['sampleSolidId'].disable();
            logVisualMonitoringControl.controls['sampleFoamId'].disable();
            logVisualMonitoringControl.controls['sampleOdorId'].disable();
            logVisualMonitoringControl.controls['other'].disable();
        }
    }

    addMoreLogVisualMonitoring() {
        this.addLogVisualMonitoringResult({});
        this.addToModelLogVisualMonitoringList();
        this.disableContinue = true;
        for (let i = 0; i < (this.model.logVisualMonitoringList.length - 1); i++) {
            this.isOpen[i] = false;
        }
        const index = this.model.logVisualMonitoringList.length - 1;
        this.defaultOpnPanelIds.push('sample_' + index);
    }
    addToModelLogVisualMonitoringList() {
        if (this.model.logVisualMonitoringList == null || this.model.logVisualMonitoringList.length === 0) {
            this.model.logVisualMonitoringList = [];
        }
        this.model.logVisualMonitoringList.push({
            'sampleDischargeMonitId': null,
            'seasonSampleId': '-1',
            'seasonSampleName': '',
            'sampleDate': '',
            'sampleNodiCodeId': '-1',
            'sampleColorCodeId': '-1',
            'sampleSheenId': '-1',
            'sampleSolidId': '-1',
            'sampleFoamId': '-1',
            'sampleOdorId': '-1',
            'other': ''
        });
    }

    removeLogSample(i: number, deleteInd: string) {

        this.errorsList = [];
        this.error_fields = [];
        const compDelPOP = document.getElementById('deleteLogSamplePopovers_' + i);
        let hasError = false;
        if (deleteInd === 'Y') {
            if (this.model.logVisualMonitoringList[i].sampleDischargeMonitId) {
                this.service.deleteOutfallSampleVisualMs4List(this.model.outfallDetails.outfallMonitId, this.model.logVisualMonitoringList[i].sampleDischargeMonitId).subscribe(
                    response => {
                        // This will all data
                    },
                    error => {
                        this.errorsList = this.errorHandler.getErrors(error);
                        this.error_fields = this.errorHandler.getErrorFields(error);
                        hasError = true;
                    });
            }
            if (!hasError) {
                this.logVisualMonitoringFormList.removeAt(i);
                this.model.logVisualMonitoringList.splice(i, 1);
                this.isOpen.splice(i, 1);
            }
            this.disableContinue = false;
            for (let i = 0; i < this.model.logVisualMonitoringList.length; i++) {
                if (this.logVisualMonitoringFormList.at(i).get('seasonSampleId').enabled) {
                    this.disableContinue = true;
                }
            }
        }

        this.closePopOver(compDelPOP);
    }

    private closePopOver(element) {
        const event = new MouseEvent('click', { bubbles: false });
        this.render.invokeElementMethod(element, 'dispatchEvent', [event]);
    }

    onSeasonSelect = (sampleIndex: number, selectedSeasonId: any) => {
        if (selectedSeasonId === '-1') {
            this.model.logVisualMonitoringList[sampleIndex].seasonSampleName = '';
        } else {
            const selectedSeasonDetail = _.find(this.model.seasonSampleList, { code: selectedSeasonId });
            this.model.logVisualMonitoringList[sampleIndex].seasonSampleName = selectedSeasonDetail.value;
        }
    }

    private calMinMaxDate(): void  {
        const todayDate = new Date();
        this.currentDate = { year: todayDate.getFullYear(), month: todayDate.getMonth() + 1, day: todayDate.getUTCDate() };
        this.maxDate = { year: this.currentDate.year + 1, month: this.currentDate.month, day: this.currentDate.day };
    }

    updateSampleDate(selectedDate: NgbDate, index) {
        this.model.logVisualMonitoringList[index].sampleDate = this.utils.convertDateToString(selectedDate);
    }
}
