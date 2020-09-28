import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { DmrServices } from '../../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../../shared/errorHandler';

import { Utils } from '../../../../shared/Utils';
import * as _ from 'lodash';
import { MydeqAlertModalComponent } from '../../../../shared/modals/alert-modal/alert.component';

@Component({
    selector: 'ms4-monitoring-location',
    templateUrl: './ms4-monitoring-location.component.html'
})
export class DischargeMonitoringLocationComponent implements OnInit {

    @ViewChild(MydeqAlertModalComponent, {static: true}) myAlertModal: MydeqAlertModalComponent;
    error_fields: any[] = [];
    errorsList: any[] = [];
    dischargeMonitoringLocationForm: FormGroup;
    prevPage = '';
    nextPage = '';
    model: any = {};
    outfallId = '';
    showOldOutfallList = false;
    showNewOutFallList = false;
    outfallList: any = {};
    locationTypeDefault: any = [];
    newOutfallDetailsList: FormArray = new FormArray([]);
    constructor(
        public utils: Utils,
        public route: ActivatedRoute,
        public router: Router,
        public formBuilder: FormBuilder,
        public service: DmrServices,
        public errorHandler: MyDeqErrorHandler

    ) {
        this.dischargeMonitoringLocationForm = this.formBuilder.group({
            booleanAnswer: new FormControl(),
            outfallId: new FormControl('-1'),
            newOutfallDetailsList: this.newOutfallDetailsList
        });

        const dummyWindow = window as any;

        if (dummyWindow.addEventListener) {
            dummyWindow.addEventListener('message', this.onPostMessage, false);
        } else if (dummyWindow.attachEvent) {
            dummyWindow.attachEvent('message', this.onPostMessage);
        }
    }

    ngOnInit() {
        this.locationTypeDefault.push({ code: 'OUTFAL', Value: 'Outfall' });
        this.locationTypeDefault.push({ code: 'FSP', Value: 'Field Screening Point' });

        this.service.getLogMonitoringLocations().subscribe(
            response => {
                this.model = response;
                this.prevPage = response.previous_page;
                this.dischargeMonitoringLocationForm.reset({
                    booleanAnswer: response.booleanAnswer,
                    outfallId: response.outfallId ? response.outfallId : '-1'
                });
                this.showHideSubQuestion(response.booleanAnswer, response.outfallId);
                this.outfallList = response.outfallDetailsList;
                this.addSingleRow();
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
            }, () => {

            });
    }

    showHideSubQuestion(booleanAnswer: string, outfallId: string) {
        if (booleanAnswer === 'Y') {
            this.showOldOutfallList = true;
            this.showNewOutFallList = false;
        } else if (booleanAnswer === 'N') {
            this.showOldOutfallList = false;
            this.showNewOutFallList = true;
        }
        if (!outfallId) {
            outfallId = '-1';
        }
    }


    addSingleRow() {
        this.newOutfallDetailsList.push(new FormGroup({
            locationType: new FormControl('-1'),
            outfallName: new FormControl(''),
            latitude: new FormControl(''),
            longitude: new FormControl('-'),
            outfallId: new FormControl('')
        }));
    }
    addSingleNewRow(outfallLocation) {
        this.newOutfallDetailsList.push(new FormGroup({
            locationType: new FormControl('-1'),
            outfallName: new FormControl(outfallLocation.outfallName),
            latitude: new FormControl(this.utils.correctLatLong(true, outfallLocation.latitude)),
            longitude: new FormControl(this.utils.correctLatLong(true, outfallLocation.longitude)),
            outfallId: new FormControl(outfallLocation.outFallId)
        }));
        console.log('added single row', this.newOutfallDetailsList);
    }

    continue(form: any) {
        if ('N' === form.booleanAnswer) {
            form.outfallId = '-1';
        } else if ('Y' === form.booleanAnswer) {
            form.newOutfallDetailsList = null;
        }
        console.log('form', form);
        this.service.putLogMonitoringLocation(form).subscribe(
            response => {
                this.utils.navigateTo(response.next_page, true, true);
            },
            error => {
                this.errorsList = this.errorHandler.getErrors(error);
                this.error_fields = this.errorHandler.getErrorFields(error);
            });
    }

    goBack() {
        this.utils.navigateTo(this.model.previous_page, true, true);
    }

    isEvenRow(index: number) {
        return (index % 2) === 0;
    }

    loadMap = (index: number) => {
        let map = this.utils.mapUrl.GIS_MYDEQ_MAP +'topic=waterbody&';
        // Default Lat Long
        let lat: String = '33.4488';
        let long: String = '-112.0876';
        let zoom: String = '10';
        let selectedLatLong: String = '';
        for (let i = 0; i < this.newOutfallDetailsList.controls.length; i++) {
            const outfall: any = this.newOutfallDetailsList.controls[i];
            if (outfall.controls['latitude'].value) {
                selectedLatLong += (i !== 0) ? ';' : '';
                selectedLatLong += outfall.controls['latitude'].value + ',' + outfall.controls['longitude'].value;
                if (i == index) {
                    lat = outfall.controls['latitude'].value;
                    long = outfall.controls['longitude'].value;
                }
            }
        }
        if (selectedLatLong) {
            zoom = '15';
            map += '&zoom=' + zoom + '&points=' + selectedLatLong;
        } else {
            map += '&zoom=' + zoom;
        }

        if (this.utils.placeBarObj && this.utils.placeBarObj.address && this.utils.placeBarObj.address.latitude) {
            lat = this.utils.placeBarObj.address.latitude;
            long = this.utils.placeBarObj.address.longitude;
        }

        if (lat === '33.4488' && long === '-112.0876' && this.newOutfallDetailsList.length > 0) {
            const outfall1: any = this.newOutfallDetailsList.controls[0];
            if (outfall1.controls['latitude'].value) {
                lat = outfall1.controls['latitude'].value;
                long = outfall1.controls['longitude'].value;
            }
        }

        map += '&latitude=' + lat + '&longitude=' + long;
        map += '&click=single'
        if (window.innerWidth <= 640) {
            // if width is smaller then 640px, open the link in new tab
            window.open(map, '_blank');
        } else {
            const width = window.innerWidth * 0.7;
            const height = width * window.innerHeight / window.innerWidth;
            // Ratio the hight to the width as the user screen ratio
            window.open(map, 'newwindow', 'width=' + width + ', height=' + height +
                ', top=' + ((window.innerHeight - height)) + ', left=' + ((window.innerWidth - width) / 2));
        }
    }

    onPostMessage = (event) => {
        console.log('post message is called !')
        if (event && event.data && event.data.latitude && event.data.event  ===  'click') {
            const outfall: any = this.newOutfallDetailsList.controls[0];
            if (outfall.controls['latitude'] && outfall.controls['latitude'].value !== '') {
                const outfallLocation: any = {
                    outfallName: '',
                    latitude: this.utils.correctLatLong(true, event.data.latitude),
                    longitude: this.utils.correctLatLong(true, event.data.longitude),
                    outfallId: ''
                };
                this.newOutfallDetailsList.controls.pop();
                this.addSingleNewRow(outfallLocation);

            } else {
                outfall.reset({ outfallName: '', latitude: this.utils.correctLatLong(true, event.data.latitude), longitude: this.utils.correctLatLong(true, event.data.longitude), outfallId: '' });
            }
        }
    }
}
