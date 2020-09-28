import { Component, OnInit } from '@angular/core';

import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MessageService } from '../../../message-bundle/message.service';
import { Utils } from '../../../shared/Utils';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class ReportSummaryComponent implements OnInit {

  errorsList: any[] = [];
  protected prevPage = '';
  showSendToCertify = false;
  isEditable = false;
  isRCOorDRO = false;
  displayLabels: any = {};

  pageText: any;
  reportingPeriod: any = {};
  noDataReason: any = {};
  selectedReportType: string;
  sampleStartDate: string;
  outfallsForNoDiCodeList: any = [];
  outfallSampleCountList: any = [];
  optionalOutfallSampleCountList: any = [];
  outfallSampleMethodList: any = [];
  deficiencies: any = {};
  uploadedFile: string;

  reportTypeList: any = {
    'NO_DATA_DMR': 'No Data',
    'WET_SEASON': 'Wet Season Monitoring',
    'ACC_MONIT': 'Accelerated Monitoring',
    'OTHER': 'Other'
  }

  methodTypeList: any = {
    'GRAB': 'Grab',
    'FLOW_WGHT_CONT': 'Flow-Weighted Continuous',
    'FLOW_WGHT_COMBO': 'Flow-Weighted Combination',
  }

  constructor(
    public utils: Utils,
    protected service: DmrServices,
    protected message: MessageService,
    protected errorHandler: MyDeqErrorHandler
  ) { }

  ngOnInit() {
    this.service.loadSummary().subscribe(
      response => {
        this.prevPage = response.previous_page;
        if (response && response.answeredPageList) {
          if (response.answeredPageList['REPORT_TYPE']) {
            this.selectedReportType = this.reportTypeList[response.answeredPageList['REPORT_TYPE'].dmrType];
          }
          if (response.answeredPageList['SAMPLE_DATE']) {
            this.sampleStartDate = response.answeredPageList['SAMPLE_DATE'].sampleStartDate;
          }
          if (response.answeredPageList['NO_DATA_REASON']) {
            const noData = response.answeredPageList['NO_DATA_REASON'];
            this.noDataReason = noData.noDiCodesList.find(nodi => nodi.nodiIdNo === noData.noDataReason.nodiIdNo);
          }
          if (response.answeredPageList['NODI_CODE']) {
            const noData = response.answeredPageList['NODI_CODE'];
            this.outfallsForNoDiCodeList = noData.booleanAnswer === 'Y' ? noData.outfallsForNoDiCodeList : [];
          }
          if (response.answeredPageList['DEFICIENCY_REPORT']) {
            const deficiencies = response.answeredPageList['DEFICIENCY_REPORT'];
            this.deficiencies = {
              noOfDeficiency: deficiencies.noOfDeficiency,
              isZeroDeficiencies: deficiencies.noOfDeficiency === '0'
            };
          }
          if (response.answeredPageList['SAMPLE_COUNT']) {
            const outfallSampleCount = response.answeredPageList['SAMPLE_COUNT'];
            this.outfallSampleCountList = outfallSampleCount.outfallSampleCountList.filter(outfall => outfall.optionalParamYN === 'N').sort(function (a, b) {
              if (a.outfallName < b.outfallName) {
                return -1;
              }
              if (a.outfallName > b.outfallName) {
                return 1;
              }
              return 0;
            });
            this.optionalOutfallSampleCountList = outfallSampleCount.outfallSampleCountList.filter(outfall => outfall.optionalParamYN === 'Y').sort(function (a, b) {
              if (a.outfallName < b.outfallName) {
                return -1;
              }
              if (a.outfallName > b.outfallName) {
                return 1;
              }
              return 0;
            });
          }
          if (response.answeredPageList['UPLOAD']) {
            this.uploadedFile = response.answeredPageList['UPLOAD'].fileDto ? response.answeredPageList['UPLOAD'].fileDto.fileName : 'Click to download Uploaded Excel'
          }

          if (response.answeredPageList['SAMPLE_METHOD']) {
            const outfallSampleMethod = response.answeredPageList['SAMPLE_METHOD'];
            this.outfallSampleMethodList = outfallSampleMethod.outfallSampleMethodList.sort(function (a, b) {
              if (a.outfallName < b.outfallName) {
                return -1;
              }
              if (a.outfallName > b.outfallName) {
                return 1;
              }
              return 0;
            });
          }
        }
        this.isEditable = response.editable;

        this.determineContinueBTNText(response.userRole);
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
      }
    );
  }

  goBack() {
    this.utils.navigateTo(this.prevPage, true, true);
  }

  continue() {
    if (!this.isEditable) {
      window.open('/mydeq/dashboard#', '_self');
      return;
    } else {
      this.sendForCertification();
    }
  }

  sendForCertification = () => {
    this.service.putSummary().subscribe(
      response => {
        this.utils.navigateTo(response.next_page, true, true);
      },
      error => {
        this.errorsList = this.errorHandler.getErrors(error);
      }
    );
  }

  editDetails = (pageName: string) => {
    this.utils.navigateTo(pageName, true, true);
  };

  protected determineContinueBTNText(loggedInUserrole: string) {
    if (!loggedInUserrole) {
      return;
    }
    switch (loggedInUserrole.toUpperCase()) {
      case 'RCO':
      case 'DRO':
        this.displayLabels.continueBTNTxt = 'CONTINUE';
        this.isRCOorDRO = true;
        break;
      case 'APP':
        this.displayLabels.continueBTNTxt = 'EXIT';
        break;
      default:
        this.displayLabels.continueBTNTxt = 'EXIT';
        this.isRCOorDRO = false;
        break;
    }
    if (!this.isEditable) {
      this.displayLabels.continueBTNTxt = 'EXIT';
    }
  }

  downloadSummary = () => {

    window.open(window.location.origin + '/deq-dmr/service/' + this.utils.path + '/download/downloadSummary', '_blank');
  }
}
