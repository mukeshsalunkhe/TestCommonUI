import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { DmrServices } from '../../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../../shared/errorHandler';

import { Utils } from '../../../../shared/Utils';
import * as _ from 'lodash';
import { MydeqAlertModalComponent } from '../../../../shared/modals/alert-modal/alert.component';

@Component({
    selector: 'create-discharge-event',
    templateUrl: './create-discharge-event.component.html'
})
export class CreateDischargeEventComponent implements OnInit {

    @ViewChild(MydeqAlertModalComponent, {static: true}) myAlertModal: MydeqAlertModalComponent;
    error_fields: any[] = [];
    errorsList: any[] = [];
    createDischargeForm: FormGroup;
    prevPage = '';
    nextPage = '';
    dischargeStartDate = '';
    dischargeEndDate = '';
    model: any = {};
    booleanAnswer = '';
    showSubActivities: boolean[] = [];
    index: any = 0;


    constructor(
        public utils: Utils,
        public route: ActivatedRoute,
        public router: Router,
        public formBuilder: FormBuilder,
        public service: DmrServices,
        public errorHandler: MyDeqErrorHandler
    ) {
        this.createDischargeForm = this.formBuilder.group({});

    }

    ngOnInit() {
        this.service.getCreateDischargeEvent().subscribe(
            response => {
                this.model = response;
                this.prevPage = response.previous_page;
                this.nextPage = response.next_page;
                // this.showSubActivities = new Boolean [response.dischargeActivities.length];
                /* this.errorsList = this.errorHandler.getErrors(response);
                  this.error_fields = this.errorHandler.getErrorFields(response);*/
                this.addDischargeActivtyControls(this.createDischargeForm, response.dischargeActivities, 'dischargeActivities');
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
                 console.log('Err ', this.error_fields)
            }, () => {

            });
    }


    addDischargeActivtyControls(parentFormGroup: FormGroup, subarr: any[], arrName: any) {
        let dischargeActivities: FormArray = new FormArray([]);

        subarr.forEach(eachElm => {
            const currentSubGrp = this.formBuilder.group({});
            if (eachElm.checkedInd === 'Y') {
                currentSubGrp.addControl('code', new FormControl(eachElm.code));
            } else {
                currentSubGrp.addControl('code', new FormControl(''));
            }

            if (eachElm.subDischargeActivities) {
                currentSubGrp.addControl('subDischargeActivities', this.addDischargeActivtyControls(currentSubGrp, eachElm.subDischargeActivities, 'subDischargeActivities'));
            } else {
                if (eachElm.checkedInd === 'Y') {
                    this.showSubActivities[this.index] = true;
                } else {
                    this.showSubActivities[this.index] = false;
                }
                this.index++;
            }
            dischargeActivities.push(currentSubGrp);
        })

        parentFormGroup.addControl(arrName, dischargeActivities);

        return parentFormGroup;
    }


    backClick() {
        this.utils.navigateTo(this.model.previous_page, true, true);
    }

    continue(form: any) {
        const submitData: any = {
            userSelectedDischargeActivities: []
        }
        if (form.dischargeActivities) {
            for (let i = 0; i < form.dischargeActivities.length; i++) {
                if (form.dischargeActivities[i].code) {

                    const subActivities = [];
                    if (form.dischargeActivities[i].subDischargeActivities) {
                        for (let j = 0; j < form.dischargeActivities[i].subDischargeActivities.length; j++) {
                            if (form.dischargeActivities[i].subDischargeActivities[j].code) {
                                subActivities.push({
                                    code: form.dischargeActivities[i].subDischargeActivities[j].code
                                })
                            }

                        }
                    }
                    submitData.userSelectedDischargeActivities.push({
                        code: form.dischargeActivities[i].code,
                        subDischargeActivities: subActivities
                    })
                }
            }
        }
      //  console.log("submitData", submitData);

        this.service.putCreateDischargeEvent(submitData).subscribe(
            response => {
                this.utils.navigateTo(response.next_page, true, true);
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
            });
    }

    dischargeActivitiesCheck(event, i: any) {
        let arrayControl = this.createDischargeForm.get('dischargeActivities') as FormArray;
        if (event.currentTarget.checked) {
            this.showSubActivities[i] = true;
            arrayControl.at(i).get('code').setValue(this.model.dischargeActivities[i].code);
        } else {
            this.showSubActivities[i] = false;
            arrayControl.at(i).get('code').setValue(null);
        }
    }

    subDischargeActivitiesCheck(event, i: any, j: any) {
        let arrayControl = this.createDischargeForm.get('dischargeActivities') as FormArray;
        let subDischargeActivityControls = arrayControl.at(i).get('subDischargeActivities') as FormArray;
        if (event.currentTarget.checked) {
            subDischargeActivityControls.at(j).get('code').setValue(this.model.dischargeActivities[i].subDischargeActivities[j].code);
        } else {
            subDischargeActivityControls.at(j).get('code').setValue(null);
        }
    }

    haveError(inputField: any) {
       return this.error_fields[inputField];
    }

}
