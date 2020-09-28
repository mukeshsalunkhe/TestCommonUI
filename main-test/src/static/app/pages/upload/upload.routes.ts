import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedWhatsNeededComponent } from '../common/whats-needed/whats-needed.component';
import { SharedReportingPeriodComponent } from '../common/reporting-period/reporting-period.component';
import { UploadSpreadsheetComponent } from '../common/upload-spreadsheet/upload-spreadsheet.component';
import { SharedConfirmationPageComponent } from '../common/confirmation/confirmation-page.component';
import { ErrorReportComponent } from '../common/error-report/error-report.component';
import { DischargeEventsListComponent } from './dmgp/discharge-events-list/discharge-events-list.component';
import { DischargeEventDateComponent } from './dmgp/discharge-event-date/discharge-event-date.component';
import { CreateDischargeEventComponent } from './dmgp/create-discharge-event/create-discharge-event.component';
import { LogMonitoringDetailsComponent } from '../common/log-monitoring-details/log-monitoring-details.component';
import { LogMonitoringQuestionComponent } from './ms4/log-monitoring-question/log-monitoring-question.component';
import { DischargeMonitoringLocationComponent } from './ms4/ms4-monitoring-location/ms4-monitoring-location.component';
import { Ms4ReceivingWaterComponent } from './ms4/ms4-receiving-water/ms4-receiving-water.component';
import { LogVisualMonitoringComponent } from '../common/log-visual-monitoring/log-visual-monitoring.component';
import { LogAnalyticalMonitoringComponent } from '../common/log-analytical-monitoring/log-analytical-monitoring.component';

export const uploadRoute: Routes = [

  {
    path: ':module/upload',
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
        path: 'upload_spreadsheet',
        component: UploadSpreadsheetComponent,
        data: { title: 'Upload DMR Spreadsheet', placeBarRequired: true }
      },
      {
        path: 'error_report',
        component: ErrorReportComponent,
        data: { title: 'Error Report', placeBarRequired: true }
      },
      {
        path: 'confirmation',
        component: SharedConfirmationPageComponent,
        data: { title: 'Confirmation', placeBarRequired: false }
      },
      {
        path: 'discharge_events_list',
        component: DischargeEventsListComponent,
        data: { title: 'Discharge Event List ', placeBarRequired: true }
      },
      {
        path: 'discharge_event_date',
        component: DischargeEventDateComponent,
        data: { title: 'Discharge Event Date', placeBarRequired: true }
      },
      {
        path: 'create_discharge_event',
        component: CreateDischargeEventComponent,
        data: { title: 'Discharge Event Date', placeBarRequired: true }
      },
      {
        path: 'log_monitoring_info',
        component: LogMonitoringDetailsComponent,
        data: { title: 'Log Monitoring Details', placeBarRequired: true }
      },
      {
        path: 'edit_monitoring_info/:fromPage/:eventId',
        component: LogMonitoringDetailsComponent,
        data: { title: 'Log Monitoring Details', placeBarRequired: true }
      },
      {
        path: 'edit_monitoring_info/:fromPage/:eventId',
        component: LogMonitoringDetailsComponent,
        data: { title: 'Log Monitoring Details', placeBarRequired: true }
      },
      {
        path: 'ms4_log_monitoring_q',
        component: LogMonitoringQuestionComponent,
        data: { title: 'Log Monitoring Question', placeBarRequired: true }
      },
      {
        path: 'ms4_monitoring_location',
        component: DischargeMonitoringLocationComponent,
        data: { title: 'Log Monitoring Locations', placeBarRequired: true }
      },
      {
        path: 'ms4_receiving_water',
        component: Ms4ReceivingWaterComponent,
        data: { title: 'Log Monitoring Receveing Waters', placeBarRequired: true }
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
      }
    ]
  }
]

export const uploadRouting: ModuleWithProviders = RouterModule.forRoot(uploadRoute);