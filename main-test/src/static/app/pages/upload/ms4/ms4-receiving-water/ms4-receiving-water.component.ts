import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { DmrServices } from '../../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../../shared/errorHandler';

import { Utils } from '../../../../shared/Utils';
import * as _ from 'lodash';

@Component({
    selector: 'ms4-receiving-water',
    templateUrl: './ms4-receiving-water.component.html'
})
export class Ms4ReceivingWaterComponent implements OnInit {

    error_fields: any[] = [];
    errorsList: any[] = [];
    outfallList: any[] = [];
    receivingWaterForm: FormGroup;
    protected prevPage = '';
    protected nextPage = '';
    protected primaryTextOne = '';
    protected primaryTextTwo = '';
    protected subText = '';
    protected outfallId = '';
    receivingWaterId = '-1';
    model: any = {};
    selectedWaterBodyTypes = '';


    constructor(
        protected utils: Utils,
        protected route: ActivatedRoute,
        protected router: Router,
        protected formBuilder: FormBuilder,
        protected service: DmrServices,
        protected errorHandler: MyDeqErrorHandler
    ) {
        this.receivingWaterForm = this.formBuilder.group({
            selectedWaterBodyId: new  FormControl('-1')
        });
    }

    ngOnInit() {
        this.service.getReceivingWaterBodies().subscribe(
            response => {
                this.model = response;
                this.prevPage = response.previous_page;
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
            }, () => {

            });
    }

    goBack() {
        this.utils.navigateTo(this.prevPage, true, true);
    }

    continue(form: any) {
        const selectedValue  = form.selectedWaterBodyId;
        const outfallDetails: any = {
                'selectedWaterBodyId': selectedValue
        }
        const putObj: any = {
            'outfallDetails': outfallDetails
        }
        this.service.putReceivingWaterBodies(putObj).subscribe(
            response => {
                this.utils.navigateTo(response.next_page, true, true);
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
            });
    }

    receivingWaterChange(selectdVal: string) {
        const obj = _.find(this.model.outfallDetails.waterbodyList, { waterBodyId: selectdVal });
        this.selectedWaterBodyTypes =  obj ? obj.waterBodyTypes : '';
    }
}
