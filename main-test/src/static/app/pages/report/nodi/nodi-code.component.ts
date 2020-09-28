import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';
import { MydeqAlertModalComponent } from '../../../shared/modals/alert-modal/alert.component';

@Component({
  selector: 'nodi-code',
  templateUrl: 'nodi-code.component.html'
})

export class NodiCodeComponent implements OnInit {

  @ViewChild(MydeqAlertModalComponent, { static: true }) myAlertModal: MydeqAlertModalComponent;

  errorsList: any[] = [];
  errorFields: any[] = [];
  protected prevPage = '';
  pageForm: FormGroup;
  noDiCodesList: any[] = [];
  outFallList: any[] = [];
  outFallNoDiCodeList: any[] = [];
  disabledForm: boolean;
  nodiText = 'SELECT NODI';

  constructor(
    protected utils: Utils,
    protected service: DmrServices,
    protected message: MessageService,
    protected errorHandler: MyDeqErrorHandler,
    protected formBuilder: FormBuilder,
    protected activatedRoute: ActivatedRoute) {

    this.pageForm = this.formBuilder.group({
      booleanAnswer: new FormControl(null),
      nodiIdNo: new FormControl('-1'),
    });
  }

  ngOnInit() {
    this.service.getNodiCode().subscribe(
      response => {
        this.prevPage = response.previous_page;
        this.noDiCodesList = response.noDiCodesList;
        this.outFallNoDiCodeList = response.outfallsForNoDiCodeList ? response.outfallsForNoDiCodeList : [];
        this.pageForm.get('booleanAnswer').reset(response.booleanAnswer);
        response.outFallList.forEach(outfall => {
          this.outFallList.push({
            outfallId: outfall.outfallId,
            outfallName: outfall.outfallName,
            added: (this.outFallNoDiCodeList.find(o => o.outfallId === outfall.outfallId) !== undefined)
          })
        });

      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.errorFields = this.errorHandler.getErrorFields(error);
      }, () => {
        if (this.disabledForm) {
          this.pageForm.disable();
        }
      });
  }

  createForm(outFallNoDiCode: any) {
    return new FormGroup({
      nodiIdNo: new FormControl(outFallNoDiCode.nodiIdNo ? outFallNoDiCode.nodiIdNo : '-1'),
      outfallId: new FormControl(outFallNoDiCode.outfallId ? outFallNoDiCode.outfallId : [])
    });
  }

  goBack() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  continue(form: any, navigateNextPage = true) {

    if (this.outFallNoDiCodeList.length === this.outFallList.length && form.booleanAnswer === 'Y') {
      this.myAlertModal.showErrorMessage(this.utils.ALERT.NODI_FOR_ALL);
      return;
    } else if (form.booleanAnswer === 'N') {
      this.outFallNoDiCodeList = [];
    }

    const request = {
      booleanAnswer: form.booleanAnswer,
      outfallsForNoDiCodeList: this.outFallNoDiCodeList
    }
    this.service.putNodiCode(request).subscribe(
      response => {
        if (navigateNextPage) {
          this.utils.navigateTo(response.next_page, true, true);
        }
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.errorFields = this.errorHandler.getErrorFields(error);
      });
  }

  addOutFallNoDiCode(outfall: any) {
    if (outfall.added) {
      return false;
    }
    const nodi = this.noDiCodesList.find(n => n.nodiIdNo === this.pageForm.get('nodiIdNo').value);
    this.outFallNoDiCodeList.push({
      outfallId: outfall.outfallId,
      outfallName: outfall.outfallName,
      nodiIdNo: nodi.nodiIdNo,
      nodiDesc: nodi.nodiDesc
    });
    outfall.added = true;
  }

  setNoDiCode(nodiDetails: any) {
    this.pageForm.get('nodiIdNo').reset(nodiDetails.nodiIdNo);
    this.nodiText = nodiDetails.nodiDesc;
  }

  dropDownClose(isOpen: boolean) {
    if (!isOpen) {
      this.pageForm.get('nodiIdNo').reset('-1');
      this.nodiText = 'SELECT NODI';
    }
  }

  deleteOutfall(index, outfall) {
    this.outFallNoDiCodeList.splice(index, 1);
    const outfallObj = this.outFallList.find(o => o.outfallId === outfall.outfallId);
    outfallObj.added = false;
  }

  disableForm(disabled: boolean) {
    this.disabledForm = disabled;
    if (disabled) {
      this.pageForm.disable();
    } else {
      this.pageForm.enable();
      this.continue(this.pageForm.getRawValue(), false);
    }
  }
}

