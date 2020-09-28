import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';

@Component({
  selector: 'sample-method',
  templateUrl: 'sample-method.component.html'
})

export class SampleMethodComponent implements OnInit {

  errorsList: any[] = [];
  errorFields: any[] = [];
  protected prevPage = '';
  pageForm: FormGroup;
  outfallList: any[] = [];
  maxRecord = 15;
  disabledForm: boolean;

  constructor(
    protected utils: Utils,
    protected service: DmrServices,
    protected message: MessageService,
    protected errorHandler: MyDeqErrorHandler,
    protected formBuilder: FormBuilder,
    protected activatedRoute: ActivatedRoute) {

    this.pageForm = this.formBuilder.group({
      applyGrabToAll: new FormControl('N'),
      outfallSampleMethodList: new FormArray([])
    });
  }

  ngOnInit() {
    this.service.getSampleMethod().subscribe(
      response => {
        this.prevPage = response.previous_page;
        const outfallList = this.pageForm.get('outfallSampleMethodList') as FormArray;
        if (response.outfallSampleMethodList.length > 0) {
          response.outfallSampleMethodList.forEach((outfall, index) => {
            outfall.index = index;
            outfallList.push(this.createForm(outfall));
          });
        }
        this.pageForm.get('applyGrabToAll').reset(response.applyGrabToAll);
        this.outfallList = response.outfallSampleMethodList;
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

  createForm(outfall): FormGroup {
    return new FormGroup({
      outfallId: new FormControl(outfall.outfallId ? outfall.outfallId : null),
      parameterId: new FormControl(outfall.parameterId ? outfall.parameterId : null),
      sampleMethod: new FormControl(outfall.sampleMethod ? outfall.sampleMethod : null),
      dmrSampleTypeIdNo: new FormControl(outfall.dmrSampleTypeIdNo ? outfall.dmrSampleTypeIdNo : null),
    });
  }

  goBack() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  continue(form: any, navigateNextPage = true) {
    this.service.putSampleMethod(form).subscribe(
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

  setAllGrab() {
    const outfallList = this.pageForm.get('outfallSampleMethodList') as FormArray;
    const selected: boolean = (<HTMLInputElement>document.getElementById('selectAllGrab')).checked;
    const sample: string = selected ? 'GRAB' : null;
    for (let i = 0; i < outfallList.length; i++) {
      outfallList.at(i).get('sampleMethod').reset(sample);
    }
    this.pageForm.get('applyGrabToAll').reset(selected ? 'Y' : 'N');
  }

  checkAllGrab(form: any) {
    const allSelectedGrab = form.outfallSampleMethodList.every(outfall => outfall.sampleMethod === 'GRAB');
    this.pageForm.get('applyGrabToAll').reset(allSelectedGrab ? 'Y' : 'N');
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
