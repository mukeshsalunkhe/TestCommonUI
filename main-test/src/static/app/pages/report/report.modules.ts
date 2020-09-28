import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule, NgbPopoverModule, NgbDatepickerModule, NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared/shared.module';
import { CommonPageModule } from '../common/common.module';
import { reportRouting } from './report.routes';

import { ReportTypeComponent } from './report-type/report-type.component';
import { SampleDateComponent } from './sample-date/sample-date.component'
import { NodiCodeComponent } from './nodi/nodi-code.component';
import { SampleCountComponent } from './sample-count/sample-count.component';
import { SampleMethodComponent } from './sample-method/sample-method.component';
import { DownloadExcelComponent } from './download-excel/download-excel.component';
import { NoDataReasonComponent } from './no-data-reason/no-data-reason.component';
import { ReportSummaryComponent } from './summary/summary.component';
import { DeficiencyReportComponent } from './deficiency-report/deficiency-report.component';

@NgModule({

  imports: [
    CommonModule,
    RouterModule,
    reportRouting,
    ReactiveFormsModule,
    SharedModule,
    CommonPageModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbDatepickerModule,
    NgbDropdownModule
  ],

  declarations: [
    ReportTypeComponent, SampleDateComponent, NodiCodeComponent, SampleCountComponent, SampleMethodComponent, DownloadExcelComponent, NoDataReasonComponent, ReportSummaryComponent, DeficiencyReportComponent
  ],

  exports: [

  ]
})
export class ReportModule { }
