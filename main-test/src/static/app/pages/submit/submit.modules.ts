import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { CommonPageModule } from '../common/common.module';
import { NoDataReasonQuestionComponent } from '../submit/dmgp/no_data_q/no_data_q.component';
import { DischargeEventsSavedListComponent } from '../submit/dmgp/discharge-events-saved-list/discharge-events-saved-list.component';
import { DmgpSummaryComponent } from '../submit/dmgp/dmgp-summary/dmgp-summary.component';
import { Ms4SummaryComponent } from '../submit/ms4/ms4-summary/ms4-summary.component';
import { submitRouting } from './submit.routes';


@NgModule({

  imports: [
    CommonModule,
    RouterModule,
    submitRouting,
    ReactiveFormsModule,
    SharedModule,
    CommonPageModule,
    NgbTooltipModule,
    NgbPopoverModule
  ],

  declarations: [
    NoDataReasonQuestionComponent,
    DischargeEventsSavedListComponent,
    DmgpSummaryComponent,
    Ms4SummaryComponent
  ],

  exports: [
    NoDataReasonQuestionComponent,
    DischargeEventsSavedListComponent,
    DmgpSummaryComponent,
    Ms4SummaryComponent
  ]
})
export class SubmitModule { }
