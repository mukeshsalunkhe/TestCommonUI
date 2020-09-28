import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as _ from 'lodash';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class Utils {

  title: any;
  module: string;
  path: string;
  piwikSiteIds: any[];
  tooltipText: any;

  showLoadingSign = false;
  private methodCalls: string[] = [];

  // ANALYTICS: any;
  isConfirmationPage = false;
  dateSetting: any;
  TITLE_ENUM: any;
  REPORTING_PERIOD_STATUS_CODE: any;
  ALERT: any;
  placeName: string | null;
  placeAddress: string | null;
  placeBarObj: any | null;
  ltfID: string;
  placeID: number;
  reportId: string;
  navigationExtras: NavigationExtras;

  userDetails: any = {};

  mapUrl : any = null

  constructor(private router: Router, public dpConfig: NgbDatepickerConfig) {

    this.showLoadingSign = false;

    this.piwikSiteIds = [
      { hostName: 'localhost', siteId: 1 },
      { hostName: 'mydev.azdeq.gov', siteId: 1 },
      { hostName: 'myqa.azdeq.gov', siteId: 3 },
      { hostName: 'myuat.azdeq.gov', siteId: 5 },
      { hostName: 'mybeta.azdeq.gov', siteId: 4 },
      { hostName: 'my.azdeq.gov', siteId: 6 }
    ]
    dpConfig.minDate = { year: 2000, month: 1, day: 1 };

    this.tooltipText = {
      noDataReason: '<b>Thresholds for DMGP reporting requirements:</b>  The DMGP generally requires reporting of monitoring results for discharges exceeding 0.50 million (500,000) gallons in any one day, or lasting longer than four days continuously. However, an electronic discharge monitoring report (e-DMR) must be submitted if specifically required by ADEQ as a condition in your Confirmation of DMGP Coverage documents. (DMGP Appendix A, Part B.1.). Exceptions may apply (see list under the \'\'No\'\' selection below).',
      logEvent: '<b>Thresholds for DMGP reporting requirements:</b>  The DMGP generally requires reporting of monitoring results for discharges exceeding 0.50 million (500,000) gallons in any one day, or lasting longer than four days continuously. However, an electronic discharge monitoring report (e-DMR) must be submitted if specifically required by ADEQ as a condition in your Confirmation of DMGP Coverage documents. (DMGP Appendix A, Part B.1.). Exceptions may apply.'
    };

    this.TITLE_ENUM = {
      download: 'DOWNLOAD DMR SPREADSHEET',
      upload: 'UPLOAD DMR SPREADSHEET',
      submit: 'SUBMIT DMR',
      nodata: 'NO DATA DMR',
    };

    this.navigationExtras = {
      preserveQueryParams: true,
      preserveFragment: true
    };

    this.REPORTING_PERIOD_STATUS_CODE = {
      DOWNLOADED: 'D',
      UPLOADED: 'U',
      ERROR: 'E',
      SUBMITTED: 'Y'
    }

    this.ALERT = {
      REPORT_NOT_UPLOADED: {
        title: 'ALERT: DMR SPREADSHEET NOT UPLOADED',
        msg: 'You have selected an incomplete report for submission.In order to submit a DMR, you must first upload the DMR spreadsheet. To upload: Go to your myDEQ dashboard, click the "Select an Action" dropdown and choose "Step 2: Upload" .',
        mainButtonText: 'RETURN TO mySTUFF',
        mainButtonCTA: '/mydeq/dashboard'
      },
      DMR_NOT_REQUIRED: {
        title: 'ALERT: DMR IS NOT REQUIRED',
        msg: 'You are not required at this time to submit a Discharge Monitoring Report (DMR).',
        mainButtonText: 'RETURN TO mySTUFF',
        mainButtonCTA: '/mydeq/dashboard'
      },
      ANOTHER_REQ_PENDING: {
        title: 'ALERT: ANOTHER REQUEST PENDING',
        msg: 'Your last set of changes are currently in review by ADEQ. Additional changes can not be made, till current changes are approved. Once approved you will receive an email.',
        mainButtonText: 'RETURN TO mySTUFF',
        mainButtonCTA: '/mydeq/dashboard'
      },
      ACCESS_DENIED: {
        title: 'ALERT: ACCESS DENIED',
        msg: 'You do not have permission to perform this activity, based on the user role that has been assigned to you by your Responsible Corporate Officer (RCO) or Delegated Responsible Officer (DRO). Please see your RCO or DRO for assistance changing your user role.',
        mainButtonText: 'RETURN TO mySTUFF',
        mainButtonCTA: '/mydeq/dashboard'
      },
      NO_EVENT_LOGGED_FOR_SUBMIT: {
        title: 'ALERT: MONITORING RESULTS NOT LOGGED',
        msg: 'You have not logged any monitoring results. Please use the"Log Event" action to save your monitoring results and return here to submit your DMR. ',
        mainButtonText: 'RETURN TO mySTUFF',
        mainButtonCTA: '/mydeq/dashboard'
      },
      NOT_VALID_SINGLE_SOURCE_DMR: {
        title: 'ALERT: PERMIT MODIFY REQUEST IN PROGRESS',
        msg: 'You have a permit modify request currently in process. You can log your monitoring results after the permit modify request is completed.',
        mainButtonText: 'RETURN TO mySTUFF',
        mainButtonCTA: '/mydeq/dashboard'
      },
      SUBMIT_BEFORE_END_DATE: {
        title: 'REPORTING PERIOD NOT OPEN FOR SUBMISSION',
        msg: 'This DMR reporting period is not yet open for submission. You can submit this DMR after the reporting period has ended.',
        mainButtonText: 'RETURN TO mySTUFF',
        mainButtonCTA: '/mydeq/dashboard'
      },
      SUBMIT_MS4: {
        title: 'ALERT: MONITORING RESULTS NOT LOGGED',
        msg: 'You have not logged any monitoring results. Please use the "Log DMR" action to save your monitoring results and return here to submit your DMR.',
        mainButtonText: 'RETURN TO mySTUFF',
        mainButtonCTA: '/mydeq/dashboard'
      },
      NODI_FOR_ALL: {
        title: 'ALERT: NO DATA INDICATOR FOR ALL OUTFALLS',
        msg: 'You have selected the No Data Indicator for all outfalls. Please use the No Data DMR option if you do not have any sample data to report.',
        leftButtonText: 'CANCEL'
      },
      DMR_NOT_ALLOWED: {
        title: 'ALERT: DMR ACTION NOT ALLOWED',
        msg: 'ADEQ is currently reviewing the request to terminate this NOI. You cannot submit a DMR for this permit at this time.',
        mainButtonText: 'RETURN TO mySTUFF',
        mainButtonCTA: '/mydeq/dashboard'
      }
    }
  }

  public getPiwikSiteId(hostname) {
    for (let i = 0; i < this.piwikSiteIds.length; i++) {
      const piwikSite = this.piwikSiteIds[i];
      if (piwikSite.hostName === hostname) {
        return piwikSite.siteId;
      }
    }
    return 1;
  }

  gotoDashboard = () => {
    window.location.href = window.location.origin + '/mydeq/my-stuff';
  }

  gotoCompliance = () => {
    window.location.href = window.location.origin + '/mydeq/my-compliance';
  }

  getCompletePlacebarAddress = (address) => {
    if (address) {
      let completeAddress;
      if (address.address1) {
        completeAddress = this.orEmpty(address.address1);
      }
      if (completeAddress && address.address2) {
        completeAddress = this.addConditionalSeparator(completeAddress, this.orEmpty(address.address2), ' ');
      }
      if (completeAddress && address.city) {
        completeAddress = this.addConditionalSeparator(completeAddress, this.orEmpty(address.city), ' ');
      }
      if (completeAddress && address.state) {
        completeAddress = this.addConditionalSeparator(completeAddress, this.orEmpty(address.state), ' ');
      }
      if (completeAddress && address.zip) {
        completeAddress = this.addConditionalSeparator(completeAddress, this.get5DigitZipCodeFromPlaceAddress(address), ' ');
      }
      if (!completeAddress) {
        completeAddress = 'Lat: ' + address.latitude + ' / Long: ' + address.longitude;
      }
      if (completeAddress) {
        return completeAddress.trim();
      }
    }
  }

  orEmpty = (entity) => {
    // http://stackoverflow.com/questions/20572016/javascript-string-concatenation-behavior-with-null-or-undefined-values
    // entity || "" will cause true to return "true" but false to return ""
    // both null == null and undefined == null are true
    if (entity == null) {
      return '';
    } else {
      return entity;
    }
  }

  addConditionalSeparator = (src, appendText, separator) => {
    if (src) {
      src.trim();
    }
    if (src) {
      src += separator + appendText;
    } else {
      src = appendText;
    }
    return src;
  }

  get5DigitZipCodeFromPlaceAddress = (address) => {
    if (address && address.zip && address.zip.trim()) {
      return address.zip.trim().substring(0, 5);
    }
  }

  regexCompare = (src, dest) => {
    return src.match(new RegExp(dest, 'i'));
  }


  navigateTo = (pageName: string, includePath: boolean, includeRequestParam: boolean) => {
    let url = this.module;
    if (includePath) {
      url += '/' + this.path;
    }
    url += '/' + pageName.toLocaleLowerCase();
    if (includeRequestParam) {
      this.router.navigate([url], this.navigationExtras);
    } else {
      this.router.navigate([url]);
    }
  }

  getCurrentDateMMDDYYYY = () => {
    const date = new Date()
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }

  formatDateToMMDDYYYY = (inputDate: string) => {
    const date = new Date(inputDate)
    return inputDate != null ? (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() : '';
  }

  convertDateToString(dateObj: any) {
    if (dateObj instanceof Object) {
      return this.prepandZero(dateObj.month) + '/' + this.prepandZero(dateObj.day) + '/' + dateObj.year;
    }
    return dateObj;
  }

  convertStringToDate(dateStr: string) {
    if (!dateStr) {
      return null;
    }
    const dated = new Date(dateStr);
    return { year: dated.getFullYear(), month: dated.getMonth() + 1, day: dated.getUTCDate() };
  }

  private prepandZero(inputNum: number) {
    return inputNum < 10 ? '0' + inputNum : inputNum + '';
  }

  public correctLatLong(correctLatLngFlag: boolean, inputLatlng: string): string {

    if (!correctLatLngFlag) {
      return inputLatlng;
    }
    inputLatlng = inputLatlng + '';
    const tmpArr = inputLatlng.split('.');

    if (tmpArr && tmpArr.length > 1 && tmpArr[1].length < 6) {

      do {
        tmpArr[1] = tmpArr[1] + '0';
      } while (tmpArr[1].length < 6);

      inputLatlng = tmpArr[0] + '.' + tmpArr[1];
    }
    return inputLatlng;
  }

  showLoading(callingMethodName: string) {
    if (callingMethodName) {
      this.methodCalls.push(callingMethodName);
    }
    setTimeout(() => this.showLoadingSign = true, 0);
  }

  closeLoading(callingMethodName: string = null) {
    if (callingMethodName) {
      _.pull(this.methodCalls, callingMethodName);
    }
    if (this.methodCalls && this.methodCalls.length === 0) {
      setTimeout(() => this.showLoadingSign = false, 0);
    }
  }

  trimWhiteSpaceAroundBoundary(inputJson: any): string {
    return JSON.parse(JSON.stringify(inputJson).replace(/"\s+|\s+"/g, '"'));
  }


}
