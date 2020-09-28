import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CommonPageModule } from '../common/common.module';
import { downloadRouting } from './download.routes';


@NgModule({

  imports: [
    CommonModule,
    RouterModule,
    downloadRouting,
    ReactiveFormsModule,
    SharedModule,
    CommonPageModule
  ],

  declarations: [

  ],

  exports: [
  ]
})
export class DownloadModule { }
