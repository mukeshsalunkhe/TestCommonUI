import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CommonPageModule } from '../common/common.module';

import { nodataRouting } from './nodata.routes';

import { ReasonComponent } from './reason/reason.component';


@NgModule({

  imports: [
    CommonModule,
    RouterModule,
    nodataRouting,
    ReactiveFormsModule,
    SharedModule,
    CommonPageModule
  ],

  declarations: [
    ReasonComponent
  ],

  exports: [
    ReasonComponent
  ]
})
export class NoDataModule { }
