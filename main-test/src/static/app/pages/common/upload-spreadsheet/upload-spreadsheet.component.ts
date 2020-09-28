import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';
import { MydeqAlertModalComponent } from '../../../shared/modals/alert-modal/alert.component';
import { UPLOAD_SPREADSHEET } from '../../../message-bundle/upload-spreadsheet';

@Component({
  selector: 'app-upload-spreadsheet',
  templateUrl: './upload-spreadsheet.component.html'
})
export class UploadSpreadsheetComponent implements OnInit {

  @ViewChild(MydeqAlertModalComponent, { static: true }) myAlertModal: MydeqAlertModalComponent;

  errorFields: any[] = [];
  errorsList: any[] = [];

  uploadForm: FormGroup;
  model: any = {};
  pageText: any;
  protected prevPage = '';

  ALERT: any = {
    title: 'ALERT',
    msg: 'You have uploaded a file for the wrong permit. Please select a new file',
    mainButtonText: 'OK',
    leftButtonText: 'RETURN TO mySTUFF',
    leftButtonCTA: '/mydeq/dashboard'
  }

  constructor(
    public utils: Utils,
    protected service: DmrServices,
    protected message: MessageService,
    protected errorHandler: MyDeqErrorHandler,
    protected formBuilder: FormBuilder
  ) {
    this.uploadForm = this.formBuilder.group({
      uploadFile: new FormControl(null)
    });
    this.pageText = UPLOAD_SPREADSHEET[utils.module] ? message.getJSONObject(UPLOAD_SPREADSHEET[utils.module]) : message.getJSONObject(UPLOAD_SPREADSHEET['default']);
  }

  ngOnInit() {
    this.service.getUploadDMRSheetPage().subscribe(
      response => {
        this.prevPage = response.previous_page;
        this.model = response.fileDto ? response.fileDto : {};
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
      }, () => {

      });
  }

  uploadFile(fileInput: any) {
    this.model.spreadSheetFile = fileInput.target.files[0];
  }

  continue() {
    this.errorFields = [];
    this.errorsList = [];
    this.service.uploadSheet(this.model).subscribe(
      response => {
        if (response.next_page !== 'ALERT') {
          this.utils.navigateTo(response.next_page, true, true);
          return;
        }
        this.myAlertModal.showErrorMessage(this.ALERT);
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.errorFields = this.errorHandler.getErrorFields(error);
      });
  }

  goBack() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  chooseFile = (id: string) => document.getElementById(id).click();

}
