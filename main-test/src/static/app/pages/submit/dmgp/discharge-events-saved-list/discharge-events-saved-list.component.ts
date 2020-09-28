import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { DmrServices } from '../../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../../shared/errorHandler';

import { Utils } from '../../../../shared/Utils';
import * as _ from 'lodash';
import { MydeqAlertModalComponent } from '../../../../shared/modals/alert-modal/alert.component';

@Component({
    selector: 'discharge-events-saved-list',
    templateUrl: './discharge-events-saved-list.component.html'
})
export class DischargeEventsSavedListComponent implements OnInit {

    @ViewChild(MydeqAlertModalComponent, {static: true}) myAlertModal: MydeqAlertModalComponent;
    error_fields: any[] = [];
    errorsList: any[] = [];
    dischargeEventForm: FormGroup;
    prevPage = '';
    nextPage = '';
    model: any = {};
    booleanAnswer = '';
    showSavedEventSection = false;
    showSubmittedEventSection = false;
    savedEventList: any = [{}];
    submittedEventList: any = {};
    eventListArray: FormArray = new FormArray([]);


    constructor(
        protected utils: Utils,
        protected route: ActivatedRoute,
        protected router: Router,
        protected formBuilder: FormBuilder,
        protected service: DmrServices,
        protected errorHandler: MyDeqErrorHandler
    ) {
        this.dischargeEventForm = this.formBuilder.group({
            eventListArray: this.eventListArray
        });
    }

    onLoadDischargeList() {
        this.service.gettDischargeSavedEventList().subscribe(
            response => {
                this.model = response;
                this.prevPage = response.previous_page;
                this.booleanAnswer = response.booleanAnswer;
                this.savedEventList = _.filter(this.model.dischargeEventList, { status: 'SAVED' });
                if (this.savedEventList && this.savedEventList.length > 0) {
                    this.showSavedEventSection = true;
                    for (let i = 0; i < this.savedEventList.length; i++) {
                        this.addControls(this.savedEventList[i], i);
                    }
                }
                this.submittedEventList = _.filter(this.model.dischargeEventList, { status: 'SUBMITTED' });
                if (this.submittedEventList && this.submittedEventList.length > 0) {
                    this.showSubmittedEventSection = true;
                }

            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
            }, () => {

            });
    }

    private addControls(eventInfo, index) {
        this.eventListArray.push(new FormGroup({
            checkEventId: new FormControl(''),
            eventId: new FormControl(eventInfo.eventId)
        }));
        if (this.isChecked(eventInfo.eventId)) {
            this.eventListArray.at(index).get('checkEventId').setValue(true);
        } else {
            this.eventListArray.at(index).get('checkEventId').setValue(false);
        }
    }

    public isChecked(eventIdFromPage): boolean {
        const eventInfos: any = _.find(this.model.selectedEventList, { eventId: eventIdFromPage });
        if (eventInfos) {
            return true;
        }
        return false;
    }

    ngOnInit() {
        this.onLoadDischargeList();
    }

    viewDischargeEventDetails(eventId) {
        // this.router.navigate(['/edit_monitoring_info/' + eventId]);
        // alert(eventId)
        this.utils.navigateTo('/edit_monitoring_info/discharge_events_saved_list/' + eventId, true, true);
    }


    backClick() {
        this.utils.navigateTo(this.prevPage, true, true);
    }

    continue(form: any) {
        /* console.log('form.eventListArray',form.eventListArray);
         if(form && form.eventListArray && form.eventListArray.length > 0){
             for(let i = 0; i < form.eventListArray.length ; i++){
                 console.log(form.eventListArray[i].eventId, form.eventListArray[i].checkEventId);
                 if(!form.eventListArray[i].checkEventId || '' === form.eventListArray[i].checkEventId  || 'false' === form.eventListArray[i].checkEventId ){
                     console.log('removed ', form.eventListArray[i].eventId);
                     form.eventListArray.splice(i,1);
                 }
             }
         }
         console.log('after from',form);*/
         const selectedEventList: any = [];
        for (let i = 0; i < this.eventListArray.length; i++) {
            console.log(this.eventListArray.at(i).get('eventId').value);
            console.log(this.eventListArray.at(i).get('checkEventId').value);
            if (this.eventListArray.at(i).get('checkEventId').value) {
                selectedEventList.push({'eventId': this.eventListArray.at(i).get('eventId').value});
            }
        }
        console.log('selectedEventList', selectedEventList);
        this.service.putDischargeSavedEventList({ selectedEventList: selectedEventList }).subscribe(
            response => {
                this.utils.navigateTo(response.next_page, true, true);
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
            });

    }

    isEvenRow(index: number) {
        return (index % 2) === 0;
    }

}
