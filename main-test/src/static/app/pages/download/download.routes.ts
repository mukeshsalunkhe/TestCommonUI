import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedWhatsNeededComponent } from '../common/whats-needed/whats-needed.component';
import { SharedReportingPeriodComponent } from '../common/reporting-period/reporting-period.component';
import { SharedConfirmationPageComponent } from '../common/confirmation/confirmation-page.component';


export const downloadRoute: Routes = [

  {
    path: ':module/download',
    children: [
      {
        path: 'whats_needed',
        component: SharedWhatsNeededComponent,
        data: { title: 'Information needed to complete this process', placeBarRequired: false }
      },
      {
        path: 'reporting_period',
        component: SharedReportingPeriodComponent,
        data: { title: 'Select Reporting Period', placeBarRequired: true }
      },
      {
        path: 'confirmation',
        component: SharedConfirmationPageComponent,
        data: { title: 'Download Your DMR Spreadsheet', placeBarRequired: false }
      }
    ]
  }
]

export const downloadRouting: ModuleWithProviders = RouterModule.forRoot(downloadRoute);