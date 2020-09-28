import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/pages/error/404-page/404.component';
import { ErrorPageComponent } from './shared/pages/error/500-page/500.component';

import { InventoryComponent } from './pages/common/inventory/inventory.component';

export const dmrRoute: Routes = [
  {
    path: 'error',
    component: ErrorPageComponent,
    data: { title: 'Error', placeBarRequired: false }
  },
  {
    path: ':module/error/mydeq/failure',
    component: ErrorPageComponent,
    data: { title: 'Error', placeBarRequired: false }
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: { title: 'Page Not Found' }
  }
];

export const dmrRouting: ModuleWithProviders = RouterModule.forRoot(dmrRoute)