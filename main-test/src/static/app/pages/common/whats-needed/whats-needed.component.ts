import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';
import { MydeqAlertModalComponent } from '../../../shared/modals/alert-modal/alert.component';

@Component({
    selector: 'app-whats-needed',
    templateUrl: './whats-needed.component.html'
})

export class SharedWhatsNeededComponent implements OnInit {
    @ViewChild(MydeqAlertModalComponent, {static: true}) myAlertModal: MydeqAlertModalComponent;
    errorsList: any[] = [];
    protected prevPage = '';
    pageText: any;

    constructor(
        protected utils: Utils,
        protected service: DmrServices,
        protected message: MessageService,
        protected errorHandler: MyDeqErrorHandler,
        protected activatedRoute: ActivatedRoute) {
        this.pageText = this.message.getWhatsNeededText();
    }

    ngOnInit() {
        let placeID: string;
        let ltfID: string;
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            placeID = params['placeId'];
            ltfID = params['permitId'];
            if (!ltfID) {
                return;
            }
            
            this.service.getWhatsNeeded(placeID, ltfID).subscribe(
                response => {
                    this.prevPage = response.previous_page;
                    if (response.validAccessInd === 'N') {
                        this.myAlertModal.showErrorMessage(this.utils.ALERT.ACCESS_DENIED);
                    } else if (response.validAppInd === 'N') {
                        this.myAlertModal.showErrorMessage(this.utils.ALERT.ANOTHER_REQ_PENDING);
                    } else if (response.dmrInd === 'N') {
                        this.myAlertModal.showErrorMessage(this.utils.ALERT.DMR_NOT_REQUIRED);
                    } else if (response.validSubmitInd === 'A') {
                        this.myAlertModal.showErrorMessage(this.utils.ALERT.NO_EVENT_LOGGED_FOR_SUBMIT);
                    } else if (response.validLogSubmitInd === 'Y') {
                        this.myAlertModal.showErrorMessage(this.utils.ALERT.NOT_VALID_SINGLE_SOURCE_DMR);
                    }
                },
                error => {
                    this.errorsList = this.errorHandler.getErrors(error);
                }, () => {

                });
        });
    }

    goBack() {
        if (this.utils.module === 'msgp') {
            this.utils.path = 'report';
            this.utils.navigateTo(this.prevPage, true, true);
        } else {
            window.location.href = '/mydeq/dashboard';
        }
    }

    continue() {
        this.service.putWhatsNeeded().subscribe(
            response => {
                this.utils.navigateTo(response.next_page, true, true);
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
            });
    }



}
