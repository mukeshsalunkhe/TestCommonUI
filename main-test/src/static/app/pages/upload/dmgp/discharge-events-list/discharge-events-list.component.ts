import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { DmrServices } from '../../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../../shared/errorHandler';

import { Utils } from '../../../../shared/Utils';
import * as _ from 'lodash';
import { MydeqAlertModalComponent } from '../../../../shared/modals/alert-modal/alert.component';

@Component({
    selector: 'discharge-events-list',
    templateUrl: './discharge-events-list.component.html'
})
export class DischargeEventsListComponent implements OnInit {

    @ViewChild(MydeqAlertModalComponent, {static: true}) myAlertModal: MydeqAlertModalComponent;
    error_fields: any[] = [];
    errorsList: any[] = [];
    dischargeEventForm: FormGroup;
    prevPage = '';
    nextPage = '';
    model: any = {};
    booleanAnswer = '';
    showEventSection = false;


    constructor(
        public utils: Utils,
        protected route: ActivatedRoute,
        protected router: Router,
        protected formBuilder: FormBuilder,
        protected service: DmrServices,
        protected errorHandler: MyDeqErrorHandler
    ) {
        this.dischargeEventForm = this.formBuilder.group({
            booleanAnswer: new FormControl(''),
        });
    }

    onLoadDischargeList() {
        this.service.getGettingStarted().subscribe(
            response => {
                this.model = response;
                this.prevPage = response.previous_page;
                this.dischargeEventForm.reset({
                    booleanAnswer: response.booleanAnswer
                })
                if (response.dischargeEventList && response.dischargeEventList.length > 0) {
                    this.showEventSection = true;
                }
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
            }, () => {

            });
    }
    ngOnInit() {
        this.onLoadDischargeList();
    }

    viewDischargeEventnDetails(eventId) {
        // this.router.navigate(['/edit_monitoring_info/' + eventId]);
        // alert(this.route.snapshot.url[0].path);
        this.utils.navigateTo('/edit_monitoring_info/discharge_events_list/' + eventId, true, true);
    }

    deleteEvent(userSelection: string, deleteEventAppId: string) {
        if (userSelection === 'Y') {
            this.service.deleteDischargeEventList(deleteEventAppId).subscribe(
                response => {
                    this.onLoadDischargeList();
                },
                error => {
                    this.errorsList = this.errorHandler.getErrors(error);
                    this.error_fields = this.errorHandler.getErrorFields(error);
                });
        }
        document.getElementById('deleteEventAppId_' + deleteEventAppId).click();
    }

    backClick() {
        this.utils.navigateTo(this.prevPage, true, true);
    }

    continue(form: any) {
        if ('N' === form.booleanAnswer) {
            window.location.href = '/mydeq/dashboard';
        } else {
            this.service.putDischargeEventList(form).subscribe(
                response => {
                    this.utils.navigateTo(response.next_page, true, true);
                },
                error => {
                    this.errorsList = this.errorHandler.getErrors(error);
                    this.error_fields = this.errorHandler.getErrorFields(error);
                });
        }
    }

    isEvenRow(index: number) {
        return (index % 2) === 0;
    }



}
