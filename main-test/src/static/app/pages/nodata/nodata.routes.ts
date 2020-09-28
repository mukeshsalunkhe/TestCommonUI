import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedWhatsNeededComponent } from '../common/whats-needed/whats-needed.component';
import { SharedReportingPeriodComponent } from '../common/reporting-period/reporting-period.component';
import { SharedCertifyPageComponent } from '../common/certify/certify-page.component';
import { SharedConfirmationPageComponent } from '../common/confirmation/confirmation-page.component';
import { ReasonComponent } from './reason/reason.component';
import { SharedSummaryComponent } from '../common/summary/summary.component';


export const nodataRoute: Routes = [
	{
		path: ':module/nodata',
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
				path: 'no_data_reason',
				component: ReasonComponent,
				data: { title: 'Select No Data Reason', placeBarRequired: true }
			},
			{
				path: 'summary',
				component: SharedSummaryComponent,
				data: { title: 'Summary', placeBarRequired: true }
			},
			{
				path: 'certify',
				component: SharedCertifyPageComponent,
				data: { title: 'Certify your No Data Submission', placeBarRequired: true }
			},
			{
				path: 'confirmation',
				component: SharedConfirmationPageComponent,
				data: { title: 'Confirmation of Submission', placeBarRequired: false }
			}
		]
	}
]

export const nodataRouting: ModuleWithProviders = RouterModule.forRoot(nodataRoute);