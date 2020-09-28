import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';

@Component({
  selector: 'sample-count',
  templateUrl: 'sample-count.component.html',
})

export class SampleCountComponent implements OnInit {

  errorsList: any[] = [];
  errorFields: any[] = [];
  protected prevPage = '';
  pageForm: FormGroup;
  outfallList: any[] = [];
  optionalParamCountList: any[] = [];
  parameterList: any[] = [];
  sampleCountArray: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  sampleCountArray1: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  searchText: string;
  outfallSampleList: any[] = [];
  masterList: any[] = [];
  loadOutfall: boolean;
  disabledForm: boolean;
  showDelete:boolean = true

  constructor(
    public utils: Utils,
    protected service: DmrServices,
    protected message: MessageService,
    protected errorHandler: MyDeqErrorHandler,
    protected formBuilder: FormBuilder,
    protected activatedRoute: ActivatedRoute) {

    this.pageForm = this.formBuilder.group({
      booleanAnswer: new FormControl(),
      outfallSampleCountList: new FormArray([]),
      optionalParamCountList: new FormArray([]),
    });
  }

  ngOnInit() {
    if(this.utils.module === 'cgp20') {
      this.sampleCountArray = [2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
// sampleCnt = 1 or 2 
    this.service.getSampleCount().subscribe(
      response => {
        this.prevPage = response.previous_page;
        this.outfallList = response.outfallList;
        this.parameterList = response.outfallParameterList ? response.outfallParameterList.sort(function (a, b) {
          if (a.parameterName < b.parameterName) {
            return -1;
          }
          if (a.parameterName > b.parameterName) {
            return 1;
          }
          return 0;
        }) : [];
        const outfallSampleFormArray = this.pageForm.get('outfallSampleCountList') as FormArray;
        const optionalParamFormArray = this.pageForm.get('optionalParamCountList') as FormArray;
        if (response.outfallSampleCountList.length > 0) {
          response.outfallSampleCountList.forEach((outfall, index) => {
	        let sampleCnt = outfall.sampleCount ? outfall.sampleCount : this.utils.module === 'cgp20' ? '2' : '1'
            if (outfall.optionalParamYN === 'N') {
              outfall.index = outfallSampleFormArray.length;
              outfallSampleFormArray.push(this.createForm(outfall, outfall.index,sampleCnt));
              this.outfallSampleList.push(outfall);
            } else {
              outfall.index = optionalParamFormArray.length;
              optionalParamFormArray.push(this.createForm(outfall, outfall.index,sampleCnt));
              this.optionalParamCountList.push(outfall);
            }
          });
          this.masterList = [].concat(this.outfallSampleList);
        }
        if (optionalParamFormArray.length === 0) {
          const frmGroup = this.createForm({}, optionalParamFormArray.length,1);
          optionalParamFormArray.push(frmGroup);
          this.optionalParamCountList.push(frmGroup.value);
        } else {
          this.pageForm.get('booleanAnswer').reset('Y');
        }
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
        this.errorFields = this.errorHandler.getErrorFields(error);
      }, () => {
        this.loadOutfall = true;
        if (this.disabledForm) {
          if (!this.pageForm.get('booleanAnswer').value) {
            this.pageForm.get('booleanAnswer').reset('N');
          }
          this.pageForm.disable();
        }
      });
  }

  // (requied params)on ngInit = 
  // ( optionl param)addOutfall sampleCnt = 1
  createForm(outfall, index , sampleCnt ): FormGroup {
    return new FormGroup({
      outfallId: new FormControl(outfall.outfallId ? outfall.outfallId : '-1'),
      sampleCount: new FormControl(sampleCnt),
      parameterId: new FormControl(outfall.parameterId ? outfall.parameterId : '-1'),
      optionalParamYN: new FormControl(outfall.optionalParamYN ? outfall.optionalParamYN : 'Y'),
      dmrEventParamIdNo: new FormControl(outfall.dmrEventParamIdNo ? outfall.dmrEventParamIdNo : null),
      index: new FormControl(index)
    });
  }

  goBack() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  continue(form: any, navigateNextPage = true) {
    const request: any = {
      booleanAnswer: form.booleanAnswer,
      outfallSampleCountList: []
    }

    if (form.booleanAnswer === 'Y') {
      request.outfallSampleCountList = [...form.outfallSampleCountList, ...form.optionalParamCountList];
    } else {
      request.outfallSampleCountList = [...form.outfallSampleCountList]
    }
    this.service.putSampleCount(request).subscribe(
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

  addOutFallSample() {
    const optionalParamFormArray = this.pageForm.get('optionalParamCountList') as FormArray;
    if (optionalParamFormArray.length <= 75) {
      const frmGroup = this.createForm({}, optionalParamFormArray.length,1);
      optionalParamFormArray.push(frmGroup);
      this.optionalParamCountList.push(frmGroup.value);
    } else {
      this.errorsList.push('MAX LIMIT MET: Cannot add more rows');
    }
  }

  search(searchText: string) {
    if (!searchText || searchText === '') {
      this.outfallSampleList = [].concat(this.masterList);
      return;
    }
    const regularExp = new RegExp('(' + searchText.toUpperCase().trim() + ')', 'i')
    this.outfallSampleList = this.masterList.filter(o => (o.outfallName && o.outfallName.match(regularExp)) || (o.parameterName && o.parameterName.match(regularExp)));
  }

  deleteOutfall(index: number) {
    this.errorsList = [];
    const optionalParamFormArray = this.pageForm.get('optionalParamCountList') as FormArray;
    optionalParamFormArray.removeAt(index);
    this.optionalParamCountList.splice(index, 1);
  }

  disableForm(disabled: boolean) {
    this.disabledForm = disabled;
    if (disabled) {
      this.pageForm.disable();
      this.showDelete =  false
    } else {
      this.pageForm.enable();
      this.showDelete = true
      this.continue(this.pageForm.getRawValue(), false);
    }
  }
}
