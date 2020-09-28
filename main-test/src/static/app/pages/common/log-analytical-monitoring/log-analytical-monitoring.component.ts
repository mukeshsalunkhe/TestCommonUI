import { ActivatedRoute, Router } from '@angular/router';
import { Component, Renderer, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { DmrServices } from '../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../shared/errorHandler';

import { Utils } from '../../../shared/Utils';
import * as _ from 'lodash';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'log-analytical-monitoring',
    templateUrl: './log-analytical-monitoring.component.html'
})
export class LogAnalyticalMonitoringComponent implements OnInit {

    error_fields: any[] = [];
    errorsList: any[] = [];
    pageForm: FormGroup;
    pageDisplayRows: FormArray[] = [];
    logAnalyticalMonitoringFormList: FormArray = new FormArray([]);
    defaultRowCount: number[] = [];
    protected prevPage = '';
    protected nextPage = '';
    model: any = {};
    disablePage = false;
    errorRowNos: any[] = [];
    currentPageNumber: number[] = [];
    newRowCounter: number[] = [];
    private tabIndex: number[] = [];
    disableContinue = false;
    fromPage = '';
    // disableSave: boolean[] = [];
    errorPages: any[][] = [[], []];
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
        this.calMinMaxDate();
        this.pageForm = this.formBuilder.group({
            logAnalyticalMonitoringFormList: new FormArray([]),
            model: [''],
        });
    }

    ngOnInit() {
        const sub1 = this.route.params
            .subscribe(params => {
                this.fromPage = params['fromPage'];
                this.service.getLogAnalyticalMonitoring(params['fromPage'], params['samplingType'], params['outfallMonitId']).subscribe(
                    response => {
                        this.model = response;
                        this.prevPage = response.previous_page;
                        this.disablePage = false;
                        if (this.model.logAnalyticalMonitoringList != null && this.model.logAnalyticalMonitoringList.length > 0) {
                            for (let i = 0; i < this.model.logAnalyticalMonitoringList.length; i++) {
                                this.currentPageNumber.push(1);
                                this.newRowCounter.push(0);
                                this.tabIndex.push(8);
                                this.addLogAnalyticalMonitoringResult(i);
                                this.disableContinue = false;
                                // this.disableSave.push(true);
                            }
                        } else {
                            this.addMoreLogAnalyticalMonitoring();
                            this.disableContinue = true;
                            this.disablePage = false;

                        }
                      },
                    error => {
                        this.errorsList = this.errorHandler.getErrors(error);
                        this.error_fields = this.errorHandler.getErrorFields(error);
                    });
            });
    }


    enableEditLogMonit(index) {
        const sampleFormArray = this.pageForm.get('logAnalyticalMonitoringFormList') as FormArray;
        const formArray = sampleFormArray.at(index).get('ms4ExcelSheetCtrls') as FormArray;
        sampleFormArray.at(index).get('seasonSampleId').enable({ onlySelf: true });
        sampleFormArray.at(index).get('sampleDate').enable({ onlySelf: true });
        this.disableContinue = true;
        const ms4LogSampleDatas = formArray.getRawValue();
        for (let i = 0; i < formArray.length; i++) {
            formArray.at(i).get('parameterId').enable({ onlySelf: true });
            if (formArray.at(i).get('parameterId').value !== '-1') {
                formArray.at(i).get('parameterId').disable({ onlySelf: true });
            }

            formArray.at(i).get('parameterNodiCode').enable({ onlySelf: true });
            formArray.at(i).get('sampleValue').enable({ onlySelf: true });
            if (ms4LogSampleDatas[i].hardnessRequired === 'Y') {
                formArray.at(i).get('hardness').enable({ onlySelf: true });
            }

            if (ms4LogSampleDatas[i].phRequired === 'Y') {
                formArray.at(i).get('ph').enable({ onlySelf: true });
            }

            if (ms4LogSampleDatas[i].temperatureRequired === 'Y') {
                formArray.at(i).get('temperature').enable({ onlySelf: true });
            }
        }
    }

    continue(form: any) {
        if (this.fromPage) {
            this.utils.navigateTo(this.fromPage, true, true);
        } else {
            this.utils.navigateTo('ms4_log_monitoring_q', true, true);
        }
    }

    /** Called from Init */
    addLogAnalyticalMonitoringResult(index) {
        this.defaultRowCount[index] = 4;
        if (this.model.logAnalyticalMonitoringList[index].ms4LogSampleDatas && this.model.logAnalyticalMonitoringList[index].ms4LogSampleDatas.length > 0) {
            this.defaultRowCount[index] = this.model.logAnalyticalMonitoringList[index].ms4LogSampleDatas.length;
        }
        this.addSampleRow(this.model.logAnalyticalMonitoringList[index], index);
        const sampleFormArray = this.pageForm.get('logAnalyticalMonitoringFormList') as FormArray;
        sampleFormArray.at(index).get('seasonSampleId').disable({ onlySelf: true });
        sampleFormArray.at(index).get('sampleDate').disable({ onlySelf: true });

        const formArray = sampleFormArray.at(index).get('ms4ExcelSheetCtrls') as FormArray;
        const selectedSeasonDetail = _.find(this.model.seasonSampleList, { code: this.model.logAnalyticalMonitoringList[index].seasonSampleId });
        this.model.logAnalyticalMonitoringList[index].seasonSampleName = selectedSeasonDetail.value;
        for (let i = 0; i < this.model.logAnalyticalMonitoringList[index].ms4LogSampleDatas.length; i++) {
            this.model.logAnalyticalMonitoringList[index].ms4LogSampleDatas[i].haveError = this.haveError(index, i);
            if (formArray.at(i)) {
                formArray.at(i).get('parameterId').disable({ onlySelf: true });
                formArray.at(i).get('parameterNodiCode').disable({ onlySelf: true });
                formArray.at(i).get('sampleValue').disable({ onlySelf: true });
                formArray.at(i).get('hardness').disable({ onlySelf: true });
                formArray.at(i).get('ph').disable({ onlySelf: true });
                formArray.at(i).get('temperature').disable({ onlySelf: true });
                const isOptional = this.model.logAnalyticalMonitoringList[index].ms4LogSampleDatas[i].optionalIndicator === 'Y' ? true : false;
                this.model.logAnalyticalMonitoringList[index].ms4LogSampleDatas[i].showDelete = !this.disablePage && isOptional;
            }

        }
    }

    haveError = (sampleIndex: number, rowIndex: number) => {
        if (this.errorRowNos[sampleIndex] && this.errorRowNos[sampleIndex].indexOf(rowIndex) >= 0) {
            return true;
        } else {
            return false;
        }
    }

    // init // check
    private addSampleRow(logAnalyticalMonitoring: any, sampleIndex) {
        if (!this.currentPageNumber[sampleIndex]) {
            this.currentPageNumber.push(1);
        }
        if (!this.newRowCounter[sampleIndex]) {
            this.newRowCounter.push(0);
        }
        if (!this.tabIndex[sampleIndex]) {
            this.tabIndex.push(8);
        }
        this.addDefaultParameterDatas(logAnalyticalMonitoring, sampleIndex);
        this.addRow(logAnalyticalMonitoring, sampleIndex);
    }


    private addDefaultParameterDatas = (logAnalyticalMonitoring, index) => {
        const ms4LogSampleDatas: any[] = [];
        this.model.ms4DefaultParameterDatas = this.model.ms4DefaultParameterDatas ? this.model.ms4DefaultParameterDatas : [];

        // Adding Existing Sample Value. If user has already Entered.
        if (logAnalyticalMonitoring.ms4LogSampleDatas) {
            logAnalyticalMonitoring.ms4LogSampleDatas.forEach(sample => {
                ms4LogSampleDatas.push(this.getEmptySampleData(sample));
            });
        }
        // Adding Default Parameter Values. If Any
        const numberOfRows = this.defaultRowCount[index] - ms4LogSampleDatas.length;
        for (let i: number = numberOfRows - 1; i >= 0; i--) {
            const parameterId = this.model.ms4DefaultParameterDatas[i] ? this.model.ms4DefaultParameterDatas[i].parameterId : null;
            const enteredSampleDetails = ms4LogSampleDatas.find(sample => sample.parameterId === parameterId);
            if (!enteredSampleDetails) {
                ms4LogSampleDatas.push(this.getEmptySampleData(this.model.ms4DefaultParameterDatas[i]));
            }
        }
        logAnalyticalMonitoring.ms4LogSampleDatas = ms4LogSampleDatas;
    }

    addNewRowForLog(sampleIndex: number) {
        const index = this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas.length;
        this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas.push(this.getEmptySampleData());
        this.addMoreMonitoringControlRows(this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[index], sampleIndex);
    }

    private addRow = (logAnalyticalMonitoring, sampleIndex) => {
        const sampleFormArray = this.pageForm.get('logAnalyticalMonitoringFormList') as FormArray;
        sampleFormArray.push(new FormGroup({
            sampleDischargeMonitId: new FormControl(logAnalyticalMonitoring.sampleDischargeMonitId),
            seasonSampleId: new FormControl(logAnalyticalMonitoring.seasonSampleId),
            seasonSampleName: new FormControl(logAnalyticalMonitoring.seasonSampleName),
            sampleDate: new FormControl(this.utils.convertStringToDate(logAnalyticalMonitoring.sampleDate)),
            ms4ExcelSheetCtrls: new FormArray([])
        }));
        for (let i = 0; i < logAnalyticalMonitoring.ms4LogSampleDatas.length; i++) {
            this.addMoreMonitoringControlRows(logAnalyticalMonitoring.ms4LogSampleDatas[i] ? logAnalyticalMonitoring.ms4LogSampleDatas[i] : {} , sampleIndex);
        }

        for (let i: number = this.defaultRowCount[sampleIndex] - 1; i >= 0; i--) {
            const sampleData = logAnalyticalMonitoring.ms4LogSampleDatas[i];
            const isOptional = this.pageDisplayRows[sampleIndex].at(i).get('optionalIndicator').value === 'Y' ? true : false;
            if (!isOptional && sampleData && sampleData.parameterId !== '-1') {
                this.pageDisplayRows[sampleIndex].at(i).get('parameterId').disable({ onlySelf: true });
            } else {
                this.pageDisplayRows[sampleIndex].at(i).get('parameterId').enable();
            }

            this.pageDisplayRows[sampleIndex].at(i).get('parameterNodiCode').enable({ onlySelf: true });

            if (this.disablePage) {
                this.pageDisplayRows[sampleIndex].at(i).get('sampleValue').disable({ onlySelf: true });
            } else {
                this.pageDisplayRows[sampleIndex].at(i).get('sampleValue').enable({ onlySelf: true });
            }

            if (this.disablePage || sampleData && sampleData.hardnessRequired === 'N') {
                this.pageDisplayRows[sampleIndex].at(i).get('hardness').disable({ onlySelf: true });
            } else {
                this.pageDisplayRows[sampleIndex].at(i).get('hardness').enable({ onlySelf: true });
            }

            if (this.disablePage || sampleData && sampleData.phRequired === 'N') {
                this.pageDisplayRows[sampleIndex].at(i).get('ph').disable({ onlySelf: true });
            } else {
                this.pageDisplayRows[sampleIndex].at(i).get('ph').enable({ onlySelf: true });
            }

            if (this.disablePage || sampleData && sampleData.temperatureRequired === 'N') {
                this.pageDisplayRows[sampleIndex].at(i).get('temperature').disable({ onlySelf: true });
            } else {
                this.pageDisplayRows[sampleIndex].at(i).get('temperature').enable({ onlySelf: true });
            }
        }

        this.logAnalyticalMonitoringFormList = sampleFormArray;
    }

    addMoreMonitoringControlRows(logSampleDatas, sampleIndex) {
        const sampleFormArray = this.pageForm.get('logAnalyticalMonitoringFormList') as FormArray;
        let ms4ExcelSheetCtrls =  sampleFormArray.at(sampleIndex).get('ms4ExcelSheetCtrls') as FormArray
        ms4ExcelSheetCtrls.push(new FormGroup({
            idno: new FormControl(logSampleDatas.idno ? logSampleDatas.idno : null),
            optionalIndicator: new FormControl(logSampleDatas.optionalIndicator ? logSampleDatas.optionalIndicator : 'Y'),
            parameterId: new FormControl(logSampleDatas.parameterId ? logSampleDatas.parameterId : '-1'),
            sampleValue: new FormControl(logSampleDatas.sampleValue),
            unit: new FormControl({ value: logSampleDatas.unit, disabled: true }),
            hardness: new FormControl(logSampleDatas.hardness),
            hardnessRequired: new FormControl(logSampleDatas.hardnessRequired ? logSampleDatas.hardnessRequired : 'Y'),
            ph: new FormControl(logSampleDatas.ph),
            phRequired: new FormControl(logSampleDatas.phRequired ? logSampleDatas.phRequired : 'Y'),
            temperature: new FormControl(logSampleDatas.temperature),
            temperatureRequired: new FormControl(logSampleDatas.temperatureRequired ? logSampleDatas.temperatureRequired : 'Y'),
            parameterNodiCode: new FormControl(logSampleDatas.parameterNodiCode ? logSampleDatas.parameterNodiCode : '-1')
        }));
        this.pageDisplayRows[sampleIndex] = ms4ExcelSheetCtrls;

    }

    // adding from page
    addMoreLogAnalyticalMonitoring() {
        this.model.logAnalyticalMonitoringList = this.model.logAnalyticalMonitoringList ? this.model.logAnalyticalMonitoringList : [];
        const sampleIndex = this.model.logAnalyticalMonitoringList.length;
        // this.disableSave.push(false);
        this.disableContinue = true;
        if (!this.defaultRowCount[sampleIndex] || this.defaultRowCount[sampleIndex] === 0) {

            if (this.model.ms4DefaultParameterDatas && this.model.ms4DefaultParameterDatas.length !== 0) {
                this.defaultRowCount.push(this.model.ms4DefaultParameterDatas.length);
            } else {
                this.defaultRowCount.push(4);
            }
        }
        const log = {
            sampleDischargeMonitId: '',
            seasonSampleId: '-1',
            seasonSampleName: '',
            sampleDate: '',
            ms4LogSampleDatas: []
        };
        this.model.logAnalyticalMonitoringList.push(log);
        this.addSampleRow(log, sampleIndex);
        this.defaultOpnPanelIds.push('sample_' + sampleIndex)
    }


    removeLogSample(index: number, deleteInd: string) {
        const compDelPOP = document.getElementById('deleteLogSamplePopover_' + index);
        let hasError = false;
        this.errorsList = [];
        this.error_fields = [];
        this.errorRowNos[index] = [];
        if (deleteInd === 'Y') {
            if (this.model.logAnalyticalMonitoringList[index].sampleDischargeMonitId) {
                this.service.deleteOutfallSampleAnalyticalMs4List(this.model.outfallDetails.outfallMonitId, this.model.logAnalyticalMonitoringList[index].sampleDischargeMonitId).subscribe(
                    response => {
                        this.deleteLogSample(index);
                    },
                    error => {
                        this.errorsList = this.errorHandler.getErrors(error);
                        this.error_fields = this.errorHandler.getErrorFields(error);
                        hasError = true;
                    });
            } else {
                this.deleteLogSample(index);
            }
        }
        this.closePopOver(compDelPOP);
    }

    private deleteLogSample(index) {
        this.pageDisplayRows.splice(index, 1);
        const sampleFormArray = this.pageForm.get('logAnalyticalMonitoringFormList') as FormArray;
        sampleFormArray.removeAt(index);
        this.defaultRowCount.splice(index, 1);
        if (this.model.logAnalyticalMonitoringList && this.model.logAnalyticalMonitoringList[index]) {
            this.model.logAnalyticalMonitoringList.splice(index, 1);
        }
        this.disableContinue = false;
        for (let i = 0; i < this.model.logAnalyticalMonitoringList.length; i++) {
            if (this.logAnalyticalMonitoringFormList.at(i).get('seasonSampleId').enabled) {
                this.disableContinue = true;
                break;
            }
        }
    }
    private closePopOver(element) {
        const event = new MouseEvent('click', { bubbles: false });
        this.render.invokeElementMethod(element, 'dispatchEvent', [event]);
    }

    private isNotNullOrUndefined = (field: any) => {
        if (field && field !== '' && field !== '-1' && field !== '-1' && field !== -1) {
            return true;
        } else {
            return false;
        }
    }
    private isRowEmpty(element: any, index) {

        if (
            this.isNotNullOrUndefined(element.parameterId) ||
            this.isNotNullOrUndefined(element.sampleValue) ||
            this.isNotNullOrUndefined(element.unit) ||
            this.isNotNullOrUndefined(element.hardness) ||
            this.isNotNullOrUndefined(element.temperature) ||
            this.isNotNullOrUndefined(element.ph) ||
            this.isNotNullOrUndefined(element.parameterNodiCode)) {
            return false;
        } else {
            return true;
        }
    }

    handlePageChange = (sampleIndex, pageNumber: any) => {
        this.currentPageNumber[sampleIndex] = pageNumber;
        this.newRowCounter[sampleIndex] = ((this.currentPageNumber[sampleIndex] - 1) * 15);
    }

    getRowId = (sampleIndex: number, row_id: number) => {
        let rowId = this.newRowCounter[sampleIndex] + row_id
        if (rowId >= this.pageDisplayRows[sampleIndex].controls.length) {
            this.newRowCounter[sampleIndex] = 0;
            rowId = this.newRowCounter[sampleIndex] + row_id
        }
        return rowId;
    }
    getTabIndex = (sampleIndex) => {
        return this.tabIndex[sampleIndex]++;
    }
    goBack = () => {
        if (this.fromPage) {
            this.utils.navigateTo(this.fromPage, true, true);
        } else {
            this.utils.navigateTo('ms4_log_monitoring_q', true, true);
        }
    }

    public setNewRowcounter = (sampleIndex: number, evt: any) => {
        this.newRowCounter[sampleIndex] = evt;
    }

    onSeasonSelect = (sampleIndex: number, selectedSeasonId: any) => {
        if (selectedSeasonId === '-1') {
            return;
        }
        const selectedSeasonDetail = _.find(this.model.seasonSampleList, { code: selectedSeasonId });
        this.model.logAnalyticalMonitoringList[sampleIndex].seasonSampleName = selectedSeasonDetail.value;
    }

    onParameterSelect = (sampleIndex: number, selectedParameterId: any, rowNumber: number, form: any) => {
        const sampleFormArray = this.pageForm.get('logAnalyticalMonitoringFormList') as FormArray;
        const formArr = sampleFormArray.at(sampleIndex).get('ms4ExcelSheetCtrls') as FormArray;
        if (selectedParameterId && selectedParameterId === '-1') {
            const controlRow = formArr.at(rowNumber) as FormGroup;
            controlRow.get('unit').setValue('');
        }
        if (selectedParameterId && selectedParameterId !== '-1') {
            const selectedParameterDetail = _.find(this.model.optionalMs4LogSampleDatas, { parameterId: selectedParameterId });
            if (!selectedParameterDetail) { return }
            if (formArr.at(rowNumber)) {
                const controlRow = formArr.at(rowNumber) as FormGroup;
                controlRow.get('unit').setValue(selectedParameterDetail.unit);
                controlRow.get('hardnessRequired').reset(selectedParameterDetail.hardnessRequired);
                if (selectedParameterDetail.hardnessRequired === 'N') {
                    controlRow.get('hardness').reset();
                    controlRow.get('hardness').disable({ onlySelf: true });
                } else {
                    controlRow.get('hardness').enable({ onlySelf: true });
                }
                controlRow.get('phRequired').reset(selectedParameterDetail.phRequired);

                if (selectedParameterDetail.phRequired === 'N') {
                    controlRow.get('ph').reset();
                    controlRow.get('ph').disable({ onlySelf: true });
                } else {
                    controlRow.get('ph').enable({ onlySelf: true });
                }
                controlRow.get('temperatureRequired').reset(selectedParameterDetail.temperatureRequired);

                if (selectedParameterDetail.temperatureRequired === 'N') {
                    controlRow.get('temperature').reset();
                    controlRow.get('temperature').disable({ onlySelf: true });
                } else {
                    controlRow.get('temperature').enable({ onlySelf: true });
                }
            }
        } else {
            const controlRow = formArr.at(rowNumber) as FormGroup;
            controlRow.get('hardness').enable({ onlySelf: true });
            controlRow.get('ph').enable({ onlySelf: true });
            controlRow.get('temperature').enable({ onlySelf: true });
        }
    }

    // storeUserDataHelper = (sampleIndex: number, index: number, key: string, value: any) => {
    //     const sampleFormArray = this.pageForm.get('logAnalyticalMonitoringFormList') as FormArray;
    //     const formArray = sampleFormArray.at(sampleIndex).get('ms4ExcelSheetCtrls') as FormArray;
    //     formArray.at(index).get(key).reset(value);
    // }

    deleteLineItem = (sampleIndex: number, userInput: string, index: number, idno) => {
        this.errorsList = [];
        this.error_fields = [];
        this.errorRowNos[sampleIndex] = [];
        if ('Y' === userInput) {
            let hasError = false;
            if (idno) {
                this.service.deleteMs4MonitoringParam(idno).subscribe(
                    response => {
                        this.deleteLineItemHelper(sampleIndex, index);
                    },
                    error => {
                        this.errorsList = this.errorHandler.getErrors(error);
                        this.error_fields = this.errorHandler.getErrorFields(error);
                        hasError = true;
                    });
            } else {
                this.deleteLineItemHelper(sampleIndex, index);
            }
        }
        document.getElementById('deleteSample' + sampleIndex + '_' + index).click();
    }

    private deleteLineItemHelper = (sampleIndex: number, index: number) => {
        const sampleFormArray = this.pageForm.get('logAnalyticalMonitoringFormList') as FormArray;
        const ms4ExcelSheetCtrls =  sampleFormArray.at(sampleIndex).get('ms4ExcelSheetCtrls') as FormArray
        ms4ExcelSheetCtrls.removeAt(index);
        this.pageDisplayRows[sampleIndex] = ms4ExcelSheetCtrls;
        if (this.model.logAnalyticalMonitoringList && this.model.logAnalyticalMonitoringList[sampleIndex] && this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas
             && this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[index]) {
                this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas.splice(index, 1);
        }
        this.logAnalyticalMonitoringFormList = sampleFormArray;
    }

    logAnalyticalMonitoringLog(sampleIndex: number) {
        const sampleFormArray = this.pageForm.get('logAnalyticalMonitoringFormList') as FormArray;
        const form = (sampleFormArray.at(sampleIndex) as FormGroup).getRawValue();
        let analyticalMonitoringSample: any = {};
        analyticalMonitoringSample.sampleDischargeMonitId = form.sampleDischargeMonitId;
        analyticalMonitoringSample.seasonSampleId = form.seasonSampleId;
        analyticalMonitoringSample.seasonSampleName = form.seasonSampleName;
        analyticalMonitoringSample.sampleDate = this.utils.convertDateToString(form.sampleDate);
        analyticalMonitoringSample.ms4LogSampleDatas = [];

        form.ms4ExcelSheetCtrls.forEach(data => {
            if (!this.isRowEmpty(data, 0)) {
                analyticalMonitoringSample.ms4LogSampleDatas.push(data)
            }
        });

        if (analyticalMonitoringSample.ms4LogSampleDatas.length === 0) {
            analyticalMonitoringSample.ms4LogSampleDatas.push(this.getEmptySampleData());
        }

        let hasError = false;
        this.errorsList = [];
        this.error_fields = [];
        this.service.putLogAnalyticalMonitoring({
            'analyticalMonitoringSample': analyticalMonitoringSample,
            'index': sampleIndex
        }).subscribe(
            response => {
                this.errorRowNos[sampleIndex] = [];
                analyticalMonitoringSample = response.analyticalMonitoringSample;
                this.disableContinue = false;
                this.logAnalyticalMonitoringFormList.at(sampleIndex).get('sampleDischargeMonitId').reset(analyticalMonitoringSample.sampleDischargeMonitId);
                this.model.logAnalyticalMonitoringList[sampleIndex].sampleDischargeMonitId = analyticalMonitoringSample.sampleDischargeMonitId;
                this.model.logAnalyticalMonitoringList[sampleIndex].sampleDate = analyticalMonitoringSample.sampleDate;
                const formArray: any = this.logAnalyticalMonitoringFormList.at(sampleIndex).get('ms4ExcelSheetCtrls') as FormArray;
                for (let i: number = formArray.length - 1; i >= 0; i--) {
                    if (this.isRowEmpty(formArray.at(i).getRawValue(), 0)) {
                        formArray.removeAt(i);
                        this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas.splice(i, 1);
                    } else {
                        formArray.at(i).get('idno').reset(analyticalMonitoringSample.ms4LogSampleDatas[i].idno);
                        this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[i] = analyticalMonitoringSample.ms4LogSampleDatas[i];
                    }
                }
                this.logAnalyticalMonitoringFormList.at(sampleIndex).disable();
                for (let i = 0; i < this.model.logAnalyticalMonitoringList.length; i++) {
                    if (this.logAnalyticalMonitoringFormList.at(i).get('seasonSampleId').enabled) {
                        this.disableContinue = true;
                        break;
                    }
                }
                this.currentPageNumber[sampleIndex] = 1;
                this.newRowCounter[sampleIndex] = 0;
                this.tabIndex[sampleIndex] = 8;
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
                if (this.errorRowNos.length < this.model.logAnalyticalMonitoringList.length) {
                    this.errorRowNos = new Array(this.model.logAnalyticalMonitoringList.length);
                }
                this.errorRowNos[sampleIndex] = [];
                this.errorRowNos[sampleIndex] = error.errorRowNos;
                hasError = true;
                this.currentPageNumber[sampleIndex] = 1;
                this.newRowCounter[sampleIndex] = 0;
                this.tabIndex[sampleIndex] = 8;
                // console.log('-- before calling error response --');
                // this.addResponseRow(sampleIndex, analyticalMonitoringSample, ms4LogSampleDatas, hasError);
            }, () => {

            });
    }


    private addResponseRow = (sampleIndex, analyticalMonitoringSample, ms4LogSampleDatas, hasError: boolean) => {
        if (this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas == null || this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas.length === 0) {
            this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas.push(this.getEmptySampleData(undefined));
        }

        this.model.logAnalyticalMonitoringList[sampleIndex].sampleDischargeMonitId = analyticalMonitoringSample.sampleDischargeMonitId;
        this.model.logAnalyticalMonitoringList[sampleIndex].seasonSampleId = analyticalMonitoringSample.seasonSampleId;
        this.model.logAnalyticalMonitoringList[sampleIndex].sampleDate = analyticalMonitoringSample.sampleDate;
        if (this.model.logAnalyticalMonitoringList[sampleIndex].seasonSampleId !== '-1') {
            const selectedSeasonDetail = _.find(this.model.seasonSampleList, { code: this.model.logAnalyticalMonitoringList[sampleIndex].seasonSampleId });
            this.model.logAnalyticalMonitoringList[sampleIndex].seasonSampleName = selectedSeasonDetail.value;
        }

        this.defaultRowCount[sampleIndex] = Math.max(1, this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas.length);

        for (let i: number = this.defaultRowCount[sampleIndex] - 1; i >= 0; i--) {
            this.addMoreMonitoringControlRows(sampleIndex, this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[i]);
            const isOptional = this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[i].optionalIndicator === 'Y' ? true : false;
            this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[i].showDelete = !this.disablePage && isOptional;
        }
        if (!hasError) {
            this.disableEditLogMonit(sampleIndex);
        } else {
            for (let i: number = this.defaultRowCount[sampleIndex] - 1; i >= 0; i--) {
                const isOptional = this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[i].optionalIndicator === 'Y' ? true : false;
                if (this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[i].parameterId !== '-1') {
                    this.pageDisplayRows[sampleIndex].at(i).get('parameterId').disable({ onlySelf: true });
                } else {
                    this.pageDisplayRows[sampleIndex].at(i).get('parameterId').enable();
                }
               /*  if (this.disablePage || isOptional) {
                    this.pageDisplayRows[sampleIndex].at(i).get('parameterNodiCode').disable({ onlySelf: true });
                }
                else { */
                    this.pageDisplayRows[sampleIndex].at(i).get('parameterNodiCode').enable({ onlySelf: true });
                // }

                if (this.disablePage) {
                    this.pageDisplayRows[sampleIndex].at(i).get('sampleValue').disable({ onlySelf: true });
                } else {
                    this.pageDisplayRows[sampleIndex].at(i).get('sampleValue').enable({ onlySelf: true });
                }

                this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[i].showDelete = !this.disablePage && isOptional;

                if (this.disablePage || this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[i].hardnessRequired === 'N') {
                    this.pageDisplayRows[sampleIndex].at(i).get('hardness').disable({ onlySelf: true });
                } else {
                    this.pageDisplayRows[sampleIndex].at(i).get('hardness').enable({ onlySelf: true });
                }

                if (this.disablePage || this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[i].phRequired === 'N') {
                    this.pageDisplayRows[sampleIndex].at(i).get('ph').disable({ onlySelf: true });
                } else {
                    this.pageDisplayRows[sampleIndex].at(i).get('ph').enable({ onlySelf: true });
                }

                if (this.disablePage || this.model.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas[i].temperatureRequired === 'N') {
                    this.pageDisplayRows[sampleIndex].at(i).get('temperature').disable({ onlySelf: true });
                } else {
                    this.pageDisplayRows[sampleIndex].at(i).get('temperature').enable({ onlySelf: true });
                }
            }

        }
        // console.log('controls length', this.pageDisplayRows[sampleIndex].length);
        // console.log('moodel length', this.logAnalyticalMonitoringList[sampleIndex].ms4LogSampleDatas.length);

    }

    disableEditLogMonit(index) {
        const sampleFormArray = this.pageForm.get('logAnalyticalMonitoringFormList') as FormArray;
        const formArray = sampleFormArray.controls[index].get('ms4ExcelSheetCtrls') as FormArray;
        sampleFormArray.controls[index].get('seasonSampleId').disable({ onlySelf: true });
        sampleFormArray.controls[index].get('sampleDate').disable({ onlySelf: true });
        for (let i = 0; i < this.model.logAnalyticalMonitoringList[index].ms4LogSampleDatas.length; i++) {
            formArray.at(i).get('parameterId').disable({ onlySelf: true });
            formArray.at(i).get('parameterNodiCode').disable({ onlySelf: true });
            formArray.at(i).get('sampleValue').disable({ onlySelf: true });
            formArray.at(i).get('hardness').disable({ onlySelf: true });
            formArray.at(i).get('ph').disable({ onlySelf: true });
            formArray.at(i).get('temperature').disable({ onlySelf: true });
        }
    }

    private calMinMaxDate(): void  {
        const todayDate = new Date();
        this.currentDate = { year: todayDate.getFullYear(), month: todayDate.getMonth() + 1, day: todayDate.getUTCDate() };
        // this.minDate = { year: 1900, month: 1, day: 1 }
        this.maxDate = { year: this.currentDate.year + 1, month: this.currentDate.month, day: this.currentDate.day };
    }

    getEmptySampleData(sample?: any) {
        return {
            idno: sample && sample.idno ? sample.idno : null,
            optionalIndicator: sample && sample.optionalIndicator ? sample.optionalIndicator : 'Y',
            parameterId: sample && sample.parameterId ? sample.parameterId : '-1',
            sampleValue: sample && sample.sampleValue ? sample.sampleValue : '',
            unit: sample && sample.unit ? sample.unit : '',
            hardness: sample && sample.hardness ? sample.hardness : '',
            hardnessRequired: sample && sample.hardnessRequired ? sample.hardnessRequired : 'Y',
            ph: sample && sample.ph ? sample.ph : '',
            phRequired: sample && sample.phRequired ? sample.phRequired : 'Y',
            temperature: sample && sample.temperature ? sample.temperature : '',
            temperatureRequired: sample && sample.temperatureRequired ? sample.temperatureRequired : 'Y',
            parameterNodiCode: sample && sample.parameterNodiCode ? sample.parameterNodiCode : '-1',
            showDelete: sample && sample.showDelete ? sample.showDelete : true,
            haveError: sample && sample.haveError ? sample.haveError : false,
        };
    }

    updateSampleDate(selectedDate: NgbDate, index) {
        this.model.logAnalyticalMonitoringList[index].sampleDate = this.utils.convertDateToString(selectedDate);
    }

}

