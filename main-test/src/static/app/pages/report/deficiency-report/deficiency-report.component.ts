import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';
import { MydeqAlertModalComponent } from '../../../shared/modals/alert-modal/alert.component';

import { environment } from '../../../../environments/environment';

const contextPath = environment.contextPath;

@Component({
  selector: 'app-deficiency-report',
  templateUrl: './deficiency-report.component.html'
})

export class DeficiencyReportComponent implements OnInit {

  @ViewChild(MydeqAlertModalComponent, { static: true }) myAlertModal: MydeqAlertModalComponent;
  errorFields: any[] = [];
  errorsList: any[] = [];
  model: any = {};
  isZeroDeficiencies: boolean;
  protected prevPage = '';

  constructor(
    protected utils: Utils,
    protected service: DmrServices,
    protected message: MessageService,
    protected errorHandler: MyDeqErrorHandler,
    protected formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.service.getDeficiencyReport().subscribe(
      response => {
        this.model = response;
        this.isZeroDeficiencies = response.noOfDeficiency === '0';
        this.prevPage = response.previous_page;
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
      });
  }

  continue() {
    this.service.putDeficiencyReport({}).subscribe(
      response => {
        this.utils.navigateTo(response.next_page, true, true);
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
      });
  }

  goBack() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  getDeficiencyReport() {
    window.open(contextPath + '/service/' + this.utils.module + '/download/deficiencyReport', '_blank');

  }
}
