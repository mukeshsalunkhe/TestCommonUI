import { NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MydeqFooterComponent } from './mydeq-footer/mydeq-footer.component';
import { MydeqHeaderComponent } from './mydeq-header/mydeq-header.component';
import { Utils } from './Utils';
import { MyDeqErrorHandler } from './errorHandler';

import { DmrServices } from '../services/dmr/dmr.service';
import { MessageService } from '../message-bundle/message.service';

import { SessionTimeOutModalComponent } from './modals/session-timeout/modal-timeout.component';
import { DataTableDirectives } from './libs/datatable/index';
import { PageNotFoundComponent } from './pages/error/404-page/404.component';
import { ErrorPageComponent } from './pages/error/500-page/500.component';
import { MydeqAlertModalComponent } from './modals/alert-modal/alert.component';
import { LogoutService } from '../services/logout.service';
import { MultiSelectTextComponent } from './libs/multi-select-text/multi-select-text.component';
import { NgbPopoverModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderDetails } from './header-details/header-details.component';
import { NeedHelpComponent } from './libs/need-help/need-help.component';
import { SafeUrlPipe } from './pipe/safe-url-pipe';
import { PhonePipe } from './pipe/PhonePipe';
import { EditBannerComponent } from './edit-banner/edit-banner.component';
import { DropdownComponent } from './searchable-dropdown/dropdown.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPopoverModule,
    NgbDropdownModule,
    NgbAccordionModule
  ],
  declarations: [
    MydeqHeaderComponent,
    MydeqFooterComponent,
    SessionTimeOutModalComponent,
    PageNotFoundComponent,
    MydeqAlertModalComponent,
    ErrorPageComponent,
    DataTableDirectives,
    MultiSelectTextComponent,
    HeaderDetails,
    NeedHelpComponent,
    SafeUrlPipe,
    PhonePipe,
    EditBannerComponent,
    DropdownComponent
  ],
  exports: [
    MydeqHeaderComponent, MydeqFooterComponent, SessionTimeOutModalComponent,
    PageNotFoundComponent, MydeqAlertModalComponent, ErrorPageComponent, EditBannerComponent, DropdownComponent,
    DataTableDirectives, MultiSelectTextComponent, HeaderDetails, NeedHelpComponent, SafeUrlPipe, PhonePipe
  ],
  providers: [
    DmrServices, MessageService, Utils, MyDeqErrorHandler, Location, LogoutService
  ]
})
export class SharedModule { }
