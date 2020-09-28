import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbTooltipModule, NgbDateParserFormatter, NgbModalModule, NgbAccordionModule, NgbPopoverModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from './shared/libs/date-formatter/custom-date-formater';

import { NoDataModule } from './pages/nodata/nodata.modules';
import { DownloadModule } from './pages/download/download.modules';
import { UploadModule } from './pages/upload/upload.modules';
import { SubmitModule } from './pages/submit/submit.modules';
import { ReportModule } from './pages/report/report.modules';

import { Angulartics2Module } from 'angulartics2';

import { SharedModule } from './shared/shared.module';
import { dmrRouting } from './app.routes';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    RouterModule,
    dmrRouting,
    ReactiveFormsModule,
    // Angulartics2Module.forRoot(),
    NgbModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbPopoverModule,
    DownloadModule,
    NoDataModule,
    UploadModule,
    SubmitModule,
    ReportModule
  ],
  providers: [
    { provide: NgbDateParserFormatter, useFactory: () => new NgbDateFRParserFormatter('shortDate') }
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
