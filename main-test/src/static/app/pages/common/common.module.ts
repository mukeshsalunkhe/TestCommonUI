import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbPopoverModule, NgbAccordionModule, NgbModalModule, NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SharedWhatsNeededComponent } from './whats-needed/whats-needed.component';
import { SharedReportingPeriodComponent } from './reporting-period/reporting-period.component';
import { SharedCertifyPageComponent } from './certify/certify-page.component';
import { SharedConfirmationPageComponent } from './confirmation/confirmation-page.component';
import { SharedSummaryComponent } from './summary/summary.component';
import { LogMonitoringDetailsComponent } from './log-monitoring-details/log-monitoring-details.component';
import { LogAnalyticalMonitoringComponent } from './log-analytical-monitoring/log-analytical-monitoring.component';
import { LogVisualMonitoringComponent } from './log-visual-monitoring/log-visual-monitoring.component';
import { InventoryComponent } from './inventory/inventory.component';
import { UploadSpreadsheetComponent } from './upload-spreadsheet/upload-spreadsheet.component';
import { ErrorReportComponent } from './error-report/error-report.component';


@NgModule({

  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    NgbDatepickerModule,
    NgbPopoverModule,
    NgbAccordionModule,
    NgbModalModule
  ],

  declarations: [
    SharedWhatsNeededComponent,
    SharedReportingPeriodComponent,
    SharedCertifyPageComponent,
    SharedConfirmationPageComponent,
    SharedSummaryComponent,
    LogMonitoringDetailsComponent,
    LogAnalyticalMonitoringComponent,
    LogVisualMonitoringComponent,
    InventoryComponent,
    UploadSpreadsheetComponent,
    ErrorReportComponent
  ],

  exports: [
    SharedWhatsNeededComponent, SharedReportingPeriodComponent, SharedCertifyPageComponent, SharedConfirmationPageComponent, SharedSummaryComponent, LogMonitoringDetailsComponent, LogAnalyticalMonitoringComponent, LogVisualMonitoringComponent, InventoryComponent, UploadSpreadsheetComponent, ErrorReportComponent
  ],
  providers: [NgbActiveModal]
})
export class CommonPageModule { }
