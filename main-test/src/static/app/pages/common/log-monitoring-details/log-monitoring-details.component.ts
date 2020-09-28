import { Component, OnInit } from '@angular/core';
import { Utils } from '../../../shared/Utils';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { DmrServices } from '../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import * as _ from 'lodash';

@Component({
    selector: 'log-monitoring-details',
    templateUrl: './log-monitoring-details.component.html'
})
export class LogMonitoringDetailsComponent implements OnInit {

    monitoringSampleFrm: FormGroup;
    pageDisplayRows: FormArray = new FormArray([]);
    defaultRowCount = 1;
    // monitoringSampleList: any[] = [];
    rowPerPage = 10;
    errorsList: any[] = [];
    error_fields: any[] = [];
    errorPages: number[] = [];
    currentPageNumber = 1;
    newRowCounter = 0;
    backLink: string = null;
    private tabIndex = 8;
    errorRowNos: any[] = [];
    model: any = {};
    disablePrevDates = false;
    disablePage = false;

    currentDate: any;
    maxDate: any;


    constructor(
        private utils: Utils,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private service: DmrServices,
        private errorHandler: MyDeqErrorHandler) {

        this.monitoringSampleFrm = this.formBuilder.group({
            dmgpExcelSheetCtrls: this.pageDisplayRows
        });

        this.calMinMaxDate();
    }

    ngOnInit() {

        this.backLink = null;
        const sub1 = this.route.params
            .subscribe(params => {
                this.service.getLogMonitoringDetails(params['fromPage'], params['eventId']).subscribe(
                    response => {
                        this.backLink = response.previous_page;
                        this.model = response;
                        this.disablePage = response.dischargeEvent.status === 'SUBMITTED';
                        if (this.model) {
                            this.calculateDisplayRows();
                        }
                    },
                    error => {
                        this.errorsList = this.errorHandler.getErrors(error);
                    });
            });


    }

    private calculateDisplayRows = () => {
        if (this.model.dmgpExcelSheetDatas) {
            if (this.model.dmgpExcelSheetDatas.length > 0) {
                this.rowPerPage = 15;
            }
            const formArr: FormArray = this.monitoringSampleFrm.get('dmgpExcelSheetCtrls') as FormArray;
            for (let i = 0; i < this.model.dmgpExcelSheetDatas.length; i++) {

                // console.log("check ",this.model.dmgpExcelSheetDatas.length,this.monitoringSampleList[i],formArr)
                // if (!this.monitoringSampleList[i]) {
                //     this.monitoringSampleList.push({});
                // }
                // this.monitoringSampleList[i].sampleEnteredDate = this.model.dmgpExcelSheetDatas[i].sampleEnteredDate;
                // this.monitoringSampleList[i].sampleEnteredDateEditable = this.disablePage;
                // this.monitoringSampleList[i].parameterId = this.model.dmgpExcelSheetDatas[i].parameterId;
                // this.monitoringSampleList[i].sampleValue = this.model.dmgpExcelSheetDatas[i].sampleValue;
                // this.monitoringSampleList[i].unit = this.model.dmgpExcelSheetDatas[i].unit;
                // this.monitoringSampleList[i].hardness = this.model.dmgpExcelSheetDatas[i].hardness;
                // this.monitoringSampleList[i].hardnessRequired = this.model.dmgpExcelSheetDatas[i].hardnessRequired;
                // this.monitoringSampleList[i].ph = this.model.dmgpExcelSheetDatas[i].ph;
                // this.monitoringSampleList[i].phRequired = this.model.dmgpExcelSheetDatas[i].phRequired;
                // this.monitoringSampleList[i].temperature = this.model.dmgpExcelSheetDatas[i].temperature;
                // this.monitoringSampleList[i].temperatureRequired = this.model.dmgpExcelSheetDatas[i].temperatureRequired;
                // this.monitoringSampleList[i].parameterNodiCode = this.model.dmgpExcelSheetDatas[i].parameterNodiCode;
                // this.monitoringSampleList[i].optionalIndicator = this.model.dmgpExcelSheetDatas[i].optionalIndicator;
                // this.monitoringSampleList[i].haveError = this.haveError(i);

                const excelSheetData = this.model.dmgpExcelSheetDatas[i]
                this.addRow(this.model.dmgpExcelSheetDatas[i]);

                if (formArr.at(i)) {
                    // optionalIndicator check
                    const isOptional = this.model.dmgpExcelSheetDatas[i].optionalIndicator === 'Y' ? true : false;
                    formArr.at(i).get('sampleEnteredDate').reset(this.utils.convertStringToDate(excelSheetData.sampleEnteredDate));
                    formArr.at(i).get('parameterId').reset(excelSheetData.parameterId);
                    formArr.at(i).get('sampleValue').reset(excelSheetData.sampleValue);
                    formArr.at(i).get('unit').reset(excelSheetData.unit);
                    formArr.at(i).get('hardness').reset(excelSheetData.hardness);
                    formArr.at(i).get('ph').reset(excelSheetData.ph);
                    formArr.at(i).get('temperature').reset(excelSheetData.temperature);
                    formArr.at(i).get('parameterNodiCode').reset(excelSheetData.parameterNodiCode || -1);

                    if (this.disablePage || (!isOptional && this.model.dmgpExcelSheetDatas[i].parameterId !== '-1')) {
                        formArr.at(i).get('parameterId').disable({ onlySelf: true });
                    } else {
                        formArr.at(i).get('parameterId').enable({ onlySelf: true });
                    }
                    if (this.disablePage) {
                        formArr.at(i).get('sampleEnteredDate').disable({ onlySelf: true });
                    } else {
                        formArr.at(i).get('sampleEnteredDate').enable({ onlySelf: true });
                    }

                    if (this.disablePage || isOptional) {

                        formArr.at(i).get('parameterNodiCode').disable({ onlySelf: true });
                    } else {
                        formArr.at(i).get('parameterNodiCode').enable({ onlySelf: true });
                    }

                    if (this.disablePage) {
                        formArr.at(i).get('sampleValue').disable({ onlySelf: true });
                    } else {
                        formArr.at(i).get('sampleValue').enable({ onlySelf: true });
                    }

                    // this.monitoringSampleList[i].showDelete = !this.disablePage && isOptional;

                    if (this.disablePage || this.model.dmgpExcelSheetDatas[i].hardnessRequired === 'N') {
                        formArr.at(i).get('hardness').disable({ onlySelf: true });
                    } else {
                        formArr.at(i).get('hardness').enable({ onlySelf: true });
                    }

                    if (this.disablePage || this.model.dmgpExcelSheetDatas[i].phRequired === 'N') {
                        formArr.at(i).get('ph').disable({ onlySelf: true });
                    } else {
                        formArr.at(i).get('ph').enable({ onlySelf: true });
                    }

                    if (this.disablePage || this.model.dmgpExcelSheetDatas[i].temperatureRequired === 'N') {
                        formArr.at(i).get('temperature').disable({ onlySelf: true });
                    } else {
                        formArr.at(i).get('temperature').enable({ onlySelf: true });
                    }
                }

            }
        }
        if (this.model.dmgpExcelSheetDatas && this.model.dmgpExcelSheetDatas.length > 0) {

            if (this.model.dmgpExcelSheetDatas.length < this.defaultRowCount) {
                this.defaultRowCount = this.model.dmgpExcelSheetDatas.length + (this.defaultRowCount - this.model.dmgpExcelSheetDatas.length);
            } else {
                this.defaultRowCount = this.model.dmgpExcelSheetDatas.length;
            }

            if (this.disablePage) {
                this.defaultRowCount = Math.max(this.defaultRowCount, this.model.dmgpExcelSheetDatas.length);
            } else {
                this.defaultRowCount = Math.max(this.defaultRowCount, 4);
            }
        } else {
            this.defaultRowCount = 4;
        }
        // this.addMoreRows();


        // console.log("CalculateDisplay row ",this.pageDisplayRows)
    }

    addMoreRows = () => {

        for (let i: number = this.defaultRowCount; i > 0; i--) {
            const sheetData = {
                optionalIndicator: 'Y',
                sampleEnteredDate: '',
                parameterId: '-1',
                sampleValue: '',
                unit: '',
                hardness: '',
                hardnessRequired: 'Y',
                ph: '',
                phRequired: 'Y',
                temperature: '',
                temperatureRequired: 'Y',
                parameterNodiCode: '-1',
                showDelete: true,
                haveError: false,
            };
            this.model.dmgpExcelSheetDatas.push(sheetData);
            this.addRow(sheetData);
        }

        if (!this.model.dmgpExcelSheetDatas) {
            this.rowPerPage = this.model.dmgpExcelSheetDatas.length;
        }

    }

    // Create a single empty row.
    addRow = (excelSheetData: any) => {
        this.pageDisplayRows.push(new FormGroup({
            idno: new FormControl(excelSheetData.idno ? excelSheetData.idno : null),
            sampleEnteredDate: new FormControl(excelSheetData.sampleEnteredDate ? this.utils.convertStringToDate(excelSheetData.sampleEnteredDate) : null),
            optionalIndicator: new FormControl(excelSheetData.optionalIndicator ? excelSheetData.optionalIndicator : 'Y'),
            parameterId: new FormControl(excelSheetData.parameterId ? excelSheetData.parameterId : '-1'),
            sampleValue: new FormControl(excelSheetData.sampleValue ? excelSheetData.sampleValue : null),
            unit: new FormControl({ value: excelSheetData.unit ? excelSheetData.unit : null, disabled: true }),
            hardness: new FormControl(excelSheetData.hardness ? excelSheetData.hardness : null),
            hardnessRequired: new FormControl(excelSheetData.hardnessRequired ? excelSheetData.hardnessRequired : null),
            ph: new FormControl(excelSheetData.ph ? excelSheetData.ph : null),
            phRequired: new FormControl(excelSheetData.phRequired ? excelSheetData.phRequired : null),
            temperature: new FormControl(excelSheetData.temperature ? excelSheetData.temperature : null),
            temperatureRequired: new FormControl(excelSheetData.temperatureRequired ? excelSheetData.temperatureRequired : null),
            parameterNodiCode: new FormControl({ value: excelSheetData.parameterNodiCode ? excelSheetData.parameterNodiCode : '-1', disabled: true }),
            storet: new FormControl(excelSheetData.storet ? excelSheetData.storet : null),
            parameterName: new FormControl(excelSheetData.parameterName ? excelSheetData.parameterName : null)
        }));
    }

    private getUserAddList = (dmgpExcelSheetCtrls: any[]): any => {
        const lineItemList: any[] = [];
        dmgpExcelSheetCtrls.forEach(element => {
            if (!this.isRowEmpty(element)) {
                lineItemList.push({
                    sampleEnteredDate: this.utils.convertDateToString(element.sampleEnteredDate) || null,
                    parameterId: element.parameterId || '-1',
                    sampleValue: element.sampleValue || null,
                    unit: element.unit || null,
                    hardness: element.hardness || null,
                    ph: element.ph || null,
                    temperature: element.temperature || null,
                    parameterNodiCode: element.parameterNodiCode || '-1',
                    idno: element.idno,
                    temperatureRequired: element.temperatureRequired,
                    hardnessRequired: element.hardnessRequired,
                    phRequired: element.phRequired,
                    optionalIndicator: element.optionalIndicator,
                    storet: element.storet,
                    parameterName: element.parameterName ? element.parameterName : this.getParameterName(element.parameterId),
                });
            }
        });
        return lineItemList;
    }

    private isRowEmpty(element: any) {
        if (this.isNotNullOrUndefined(element.sampleEnteredDate) ||
            this.isNotNullOrUndefined(element.parameterId) ||
            this.isNotNullOrUndefined(element.sampleValue) ||
            this.isNotNullOrUndefined(element.unit) ||
            this.isNotNullOrUndefined(element.hardness) ||
            this.isNotNullOrUndefined(element.temperature) ||
            this.isNotNullOrUndefined(element.parameterNodiCode)) {
            return false;
        } else {
            return true;
        }
    }

    storeUserData = (form: any, index: number, key: string) => {
        // this.monitoringSampleList[index][key] = form.dmgpExcelSheetCtrls[index][key];
        this.storeUserDataHelper(index, key, form.dmgpExcelSheetCtrls[index][key]);

    }

    storeUserDataHelper = (index: number, key: string, value: any) => {
        this.model.dmgpExcelSheetDatas[index][key] = value;
        const formArr: FormArray = this.monitoringSampleFrm.get('dmgpExcelSheetCtrls') as FormArray;
        formArr.at(index).get(key).reset(value);
    }

    // setSampleDate = (sampleDate: string, index: number) => {
    //     this.monitoringSampleList[index].sampleEnteredDate = sampleDate;
    // }

    // getData = (index: number, field: string) => {

    //     let returnValue = (this.monitoringSampleList && index < this.monitoringSampleList.length) ? this.monitoringSampleList[index][field] : '';

    //     if (returnValue === '' && (field === 'parameterId' || field === 'parameterNodiCode')) {
    //         returnValue = '-1';
    //     }
    //     return returnValue;
    // }

    handlePageChange = (pageNumber: any) => {
        this.currentPageNumber = pageNumber;
        this.newRowCounter = ((this.currentPageNumber - 1) * this.rowPerPage);
    }

    getRowId = (row_id: number) => {
        let rowId = this.newRowCounter + row_id
        if (rowId >= this.pageDisplayRows.controls.length) {
            this.newRowCounter = 0;
            rowId = this.newRowCounter + row_id
        }
        return rowId;
    }

    deleteLineItem = (userInput: string, index: number, idno) => {
        this.error_fields = [];
        this.errorsList = [];
        if ('Y' === userInput) {

            this.errorsList = [];
            this.error_fields = [];
            if (idno) {
                this.service.deleteMonitoringParam(idno).subscribe(
                    response => {
                        this.deleteLineItemHelper(index);
                        this.model.dmgpExcelSheetDatas.splice(index, 1);
                    },
                    error => {
                        this.errorsList = this.errorHandler.getErrors(error);
                    });

            } else {
                this.deleteLineItemHelper(index);
            }
        }
        document.getElementById('rejectConfirm' + index).click();
    }

    private deleteLineItemHelper = (index: number) => {

        // this.monitoringSampleList.splice(index, 1);
        this.pageDisplayRows.removeAt(index);

    }

    isStringNullOrEmpty = (obj: any) => {

        return obj === undefined || obj === null || obj === '';

    }

    private convertItemMapToList = (itemTypeObj: any): any => {

        const itemArr: any[] = [];

        if (itemTypeObj) {
            for (const key in itemTypeObj) {
                itemArr.push(itemTypeObj[key]);
            }
        }
        return itemArr;
    }


    getTabIndex = () => {
        return this.tabIndex++;
    }

    goBack = () => {
        if (this.backLink) {
            this.utils.navigateTo(this.backLink, true, true);
        }
    }


    continue = (form: any) => {
        this.errorsList = [];
        this.error_fields = [];
        if (this.disablePage) {
            this.utils.navigateTo(this.backLink, true, true);
        } else {
            this.service.putLogMonitoringDetails({ dmgpExcelSheetDatas: this.getUserAddList(form.dmgpExcelSheetCtrls) }).subscribe(

                response => {
                    this.utils.navigateTo(response.next_page, true, true);
                },
                error => {
                    this.errorsList = this.errorHandler.getErrors(error);
                    this.error_fields = this.errorHandler.getErrorFields(error);

                    this.errorRowNos = error.errorRowNos || [];
                    this.errorPages = this.errorRowNos;
                    // this.calculateErrPages(this.errorRowNos, 0, this.rowPerPage, 1);
                    if (error && error.dmgpExcelSheetDatas) {
                        this.model = error;
                        // while (this.monitoringSampleList.length > 0) {
                        //     this.monitoringSampleList.pop();
                        // }
                        while (this.pageDisplayRows.length > 0) {
                            this.pageDisplayRows.removeAt(this.pageDisplayRows.length - 1);
                        }
                        this.newRowCounter = 0;
                        this.calculateDisplayRows();
                    }

                });
        }
    }

    onParameterSelect = (selectedParameterId: any, rowNumber: number, form: any) => {

        if (selectedParameterId && selectedParameterId !== '-1') {

            // this.storeUserData(form, rowNumber, 'parameterId');

            const selectedParameterDetail = _.find(this.model.optionalDmgpExcelSheetDatas, { parameterId: selectedParameterId });

            if (!selectedParameterDetail) { return }

            const formArr = this.monitoringSampleFrm.get('dmgpExcelSheetCtrls') as FormArray;

            if (formArr.at(rowNumber)) {
                const controlRow = formArr.at(rowNumber) as FormGroup;

                controlRow.get('unit').setValue(selectedParameterDetail.unit);
                // this.storeUserDataHelper(rowNumber, 'unit', selectedParameterDetail.unit);

                if (selectedParameterDetail.hardnessRequired === 'N') {
                    this.storeUserDataHelper(rowNumber, 'hardness', null);
                    this.storeUserDataHelper(rowNumber, 'hardnessRequired', 'N');
                    controlRow.get('hardness').reset();
                    controlRow.get('hardness').disable({ onlySelf: true });
                } else {
                    this.storeUserDataHelper(rowNumber, 'hardnessRequired', 'Y');
                    controlRow.get('hardness').enable({ onlySelf: true });
                }


                if (selectedParameterDetail.phRequired === 'N') {
                    this.storeUserDataHelper(rowNumber, 'ph', null);
                    this.storeUserDataHelper(rowNumber, 'phRequired', 'N');
                    controlRow.get('ph').reset();
                    controlRow.get('ph').disable({ onlySelf: true });
                } else {
                    this.storeUserDataHelper(rowNumber, 'phRequired', 'Y');
                    controlRow.get('ph').enable({ onlySelf: true });
                }


                if (selectedParameterDetail.temperatureRequired === 'N') {
                    this.storeUserDataHelper(rowNumber, 'temperature', null);
                    this.storeUserDataHelper(rowNumber, 'temperatureRequired', 'N');
                    controlRow.get('temperature').reset();
                    controlRow.get('temperature').disable({ onlySelf: true });
                } else {
                    this.storeUserDataHelper(rowNumber, 'temperatureRequired', 'Y');
                    controlRow.get('temperature').enable({ onlySelf: true });
                }
            }
        } else {
            const formArr = this.monitoringSampleFrm.get('dmgpExcelSheetCtrls') as FormArray;
            const controlRow = formArr.at(rowNumber) as FormGroup;
            controlRow.get('hardness').enable({ onlySelf: true });
            controlRow.get('ph').enable({ onlySelf: true });
            controlRow.get('temperature').enable({ onlySelf: true });
        }
    }


    // private calculateErrPages = (errorRowNos: any[], errIndex: number, rows: number, indexCounter: number) => {
    //     if (errIndex > errorRowNos.length - 1) {
    //         return;
    //     }

    //     if (errorRowNos[errIndex] < rows) {
    //         if (this.errorPages.indexOf(indexCounter) === -1) {
    //             this.errorPages.push(indexCounter);
    //         }
    //         this.calculateErrPages(errorRowNos, errIndex + 1, rows, indexCounter);
    //     } else {
    //         this.calculateErrPages(errorRowNos, errIndex, rows + this.rowPerPage, indexCounter + 1);
    //     }
    // }

    // haveError = (index: number) => {
    //     if (this.errorRowNos && this.errorRowNos.indexOf(index) >= 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    private isNotNullOrUndefined = (field: any) => {
        if (field && field !== '' && field !== '-1' && field !== -1) {
            return true;
        } else {
            return false;
        }
    }

    public setNewRowCounter = (evt: any) => {
        this.newRowCounter = evt;
    }

    private getParameterName(idNo: string) {
        const paramDetails = _.find(this.model.optionalDmgpExcelSheetDatas, { parameterId: idNo });

        return paramDetails ? paramDetails.parameterName : '';
    }

    private calMinMaxDate(): void  {
        const todayDate = new Date();
        this.currentDate = { year: todayDate.getFullYear(), month: todayDate.getMonth() + 1, day: todayDate.getUTCDate() };
        // this.minDate = { year: 1900, month: 1, day: 1 }
        this.maxDate = { year: this.currentDate.year + 1, month: this.currentDate.month, day: this.currentDate.day };
    }

}
