import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule, NgbPopoverModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { CommonPageModule } from '../common/common.module';

import { uploadRouting } from './upload.routes';
import { DischargeEventsListComponent } from './dmgp/discharge-events-list/discharge-events-list.component';
import { DischargeEventDateComponent } from './dmgp/discharge-event-date/discharge-event-date.component';
import { CreateDischargeEventComponent } from './dmgp/create-discharge-event/create-discharge-event.component';
import { DischargeMonitoringLocationComponent } from './ms4/ms4-monitoring-location/ms4-monitoring-location.component';
import { LogMonitoringQuestionComponent } from './ms4/log-monitoring-question/log-monitoring-question.component';
import { Ms4ReceivingWaterComponent } from './ms4/ms4-receiving-water/ms4-receiving-water.component'

@NgModule({

  imports: [
    CommonModule,
    RouterModule,
    uploadRouting,
    ReactiveFormsModule,
    SharedModule,
    CommonPageModule,
    NgbPopoverModule,
    NgbTooltipModule,
    NgbDatepickerModule
  ],

  declarations: [
    DischargeEventsListComponent,
    DischargeEventDateComponent,
    CreateDischargeEventComponent,
    LogMonitoringQuestionComponent,
    DischargeMonitoringLocationComponent,
    Ms4ReceivingWaterComponent,
  ],

  exports: [
    DischargeEventsListComponent,
    DischargeEventDateComponent,
    CreateDischargeEventComponent,
    LogMonitoringQuestionComponent,
    DischargeMonitoringLocationComponent,
    Ms4ReceivingWaterComponent,
  ]
})
export class UploadModule { }
