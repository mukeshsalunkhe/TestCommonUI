import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedWhatsNeededComponent } from '../common/whats-needed/whats-needed.component';
import { SharedReportingPeriodComponent } from '../common/reporting-period/reporting-period.component';
import { SharedCertifyPageComponent } from '../common/certify/certify-page.component';
import { SharedConfirmationPageComponent } from '../common/confirmation/confirmation-page.component';
import { NoDataReasonQuestionComponent } from '../submit/dmgp/no_data_q/no_data_q.component';
import { DischargeEventsSavedListComponent } from '../submit/dmgp/discharge-events-saved-list/discharge-events-saved-list.component';
import { DmgpSummaryComponent } from '../submit/dmgp/dmgp-summary/dmgp-summary.component';
import { LogMonitoringDetailsComponent } from '../common/log-monitoring-details/log-monitoring-details.component';
import { LogVisualMonitoringComponent } from '../common/log-visual-monitoring/log-visual-monitoring.component';
import { LogAnalyticalMonitoringComponent } from '../common/log-analytical-monitoring/log-analytical-monitoring.component';
import { Ms4SummaryComponent } from '../submit/ms4/ms4-summary/ms4-summary.component';
export const submitRoute: Routes = [

  {
    path: ':module/submit',
    children: [
      {
        path: 'whats_needed',
        component: SharedWhatsNeededComponent,
        data: { title: 'Information needed to complete this process', placeBarRequired: true }
      },
      {
        path: 'reporting_period',
        component: SharedReportingPeriodComponent,
        data: { title: 'Select Reporting Period', placeBarRequired: true }
      },
      {
        path: 'certify',
        component: SharedCertifyPageComponent,
        data: { title: 'Certify your No Data Submission', placeBarRequired: true }
      },
      {
        path: 'confirmation',
        component: SharedConfirmationPageComponent,
        data: { title: 'Submitted DMR Spreadsheet Confirmation', placeBarRequired: false }
      },
      {
        path: 'no_data_q',
        component: NoDataReasonQuestionComponent,
        data: { title: 'Nodata Reason Question', placeBarRequired: true }
      },
      {
        path: 'discharge_events_saved_list',
        component: DischargeEventsSavedListComponent,
        data: { title: 'Saved Discharge Events', placeBarRequired: true }
      },
      {
        path: 'summary',
        component: DmgpSummaryComponent,
        data: { title: 'Summary', placeBarRequired: true }
      },
      {
        path: 'edit_monitoring_info/:fromPage/:eventId',
        component: LogMonitoringDetailsComponent,
        data: { title: 'Log Monitoring Details', placeBarRequired: true }
      },
      {
        path: 'ms4_log_visual_monitoring',
        component: LogVisualMonitoringComponent,
        data: { title: 'Log Visual Monitoring Data', placeBarRequired: true }
      },
      {
        path: 'ms4_log_visual_monitoring/:fromPage/:samplingType/:outfallMonitId',
        component: LogVisualMonitoringComponent,
        data: { title: 'Visual Log Monitoring Details', placeBarRequired: true }
      },
      {
        path: 'ms4_log_analytical_monitoring',
        component: LogAnalyticalMonitoringComponent,
        data: { title: 'Log Analytical Monitoring Data', placeBarRequired: true }
      },
      {
        path: 'ms4_log_analytical_monitoring/:fromPage/:samplingType/:outfallMonitId',
        component: LogAnalyticalMonitoringComponent,
        data: { title: 'Analytical Log Monitoring Details', placeBarRequired: true }
      },
      {
        path: 'ms4_summary',
        component: Ms4SummaryComponent,
        data: { title: 'Ms4 Summary', placeBarRequired: true }
      }

    ]
  }
]

export const submitRouting: ModuleWithProviders = RouterModule.forRoot(submitRoute);