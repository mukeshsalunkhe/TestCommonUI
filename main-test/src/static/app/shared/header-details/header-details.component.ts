import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Utils } from '../Utils';
import { DmrServices } from '../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../errorHandler';

@Component({
    selector: 'header-details',
    templateUrl: './header-details.component.html'
})

export class HeaderDetails implements OnInit {

    @Output() updateEditIndicator = new EventEmitter<any>();
    @Output() disableForm = new EventEmitter<any>();
    @Input() hideEditBanner: boolean;
    @Input() hideWetSeason: boolean;

    headerInfo: any;
    type: any = {
        NO_DATA_DMR: 'No Data DMR',
        WET_SEASON: 'Wet Season Monitoring',
        ACC_MONIT: 'Accelerated Monitoring',
        OTHER: 'Other'
    }

    constructor(
        protected utils: Utils,
        protected service: DmrServices,
        protected errorHandler: MyDeqErrorHandler,
        protected formBuilder: FormBuilder,
        protected activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.service.getHeaderDetails().subscribe(
            response => {
                this.headerInfo = response.headerInfo;
                this.utils.reportId = this.headerInfo.reportingId;
                if (this.headerInfo && this.headerInfo.status !== 'DRAFT') {
                    this.disableForm.emit(true);
                }
            },
            error => {

            });
    }


    updateStatus(editObj: any) {
        this.disableForm.emit(false);
    }

}