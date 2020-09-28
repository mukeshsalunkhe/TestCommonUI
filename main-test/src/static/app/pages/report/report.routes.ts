import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportTypeComponent } from './report-type/report-type.component';
import { SharedWhatsNeededComponent } from '../common/whats-needed/whats-needed.component';
import { SampleDateComponent } from './sample-date/sample-date.component';
import { NodiCodeComponent } from './nodi/nodi-code.component';
import { InventoryComponent } from '../common/inventory/inventory.component';
import { SampleCountComponent } from './sample-count/sample-count.component';
import { SampleMethodComponent } from './sample-method/sample-method.component';
import { DownloadExcelComponent } from './download-excel/download-excel.component';
import { NoDataReasonComponent } from './no-data-reason/no-data-reason.component';
import { UploadSpreadsheetComponent } from '../common/upload-spreadsheet/upload-spreadsheet.component';
import { ErrorReportComponent } from '../common/error-report/error-report.component';
import { ReportSummaryComponent } from './summary/summary.component';
import { SharedCertifyPageComponent } from '../common/certify/certify-page.component';
import { SharedConfirmationPageComponent } from '../common/confirmation/confirmation-page.component';
import { DeficiencyReportComponent } from './deficiency-report/deficiency-report.component';

export const reportRoute: Routes = [

  {
    path: ':module',
    children: [
      {
        path: 'inventory',
        component: InventoryComponent,
        data: { title: 'Inventory', placeBarRequired: true, showSaveAndExit: true }
      },
      {
        path: 'report/report_type',
        component: ReportTypeComponent,
        data: { title: 'Select Reporting Period', placeBarRequired: true, showSaveAndExit: true }
      },
      {
        path: ':pathName',
        children: [
          {
            path: 'whatsneeded',
            component: SharedWhatsNeededComponent,
            data: { title: 'DMR | Information needed to complete this process', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'sample_date',
            component: SampleDateComponent,
            data: { title: 'DMR | Sample Start Date', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'nodi_code',
            component: NodiCodeComponent,
            data: { title: 'DMR | Select No Data for Outfall', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'sample_count',
            component: SampleCountComponent,
            data: { title: 'DMR | Sample Count', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'no_data_reason',
            component: NoDataReasonComponent,
            data: { title: 'DMR |No Data Reason', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'sample_method',
            component: SampleMethodComponent,
            data: { title: 'DMR | Sample Method', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'download',
            component: DownloadExcelComponent,
            data: { title: 'DMR | Download Excel', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'upload',
            component: UploadSpreadsheetComponent,
            data: { title: 'DMR | Download Excel', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'error_report',
            component: ErrorReportComponent,
            data: { title: 'DMR | Download Excel', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'deficiency_report',
            component: DeficiencyReportComponent,
            data: { title: 'DMR | Download Excel', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'summary',
            component: ReportSummaryComponent,
            data: { title: 'DMR | Download Excel', placeBarRequired: true, showSaveAndExit: true }
          },
          {
            path: 'certify',
            component: SharedCertifyPageComponent,
            data: { title: 'DMR | Certify your No Data Submission', placeBarRequired: true, showSaveAndExit: false }
          },
          {
            path: 'confirmation',
            component: SharedConfirmationPageComponent,
            data: { title: 'DMR | Submitted DMR Spreadsheet Confirmation', placeBarRequired: false,  showSaveAndExit: false }
          }
        ]
      }
    ]
  },
]

export const reportRouting: ModuleWithProviders = RouterModule.forRoot(reportRoute);
