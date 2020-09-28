import { Injectable } from '@angular/core';
import { Utils } from '../shared/Utils';

import { WHATS_NEEDED_TXT } from './whats-needed';
import { REPORTING_PERIOD_TXT } from './reporting-period';
import { CONFIRMATION_TXT } from './confirmation';
import { REASON_TXT } from './reason';
import { UPLOAD_SPREADSHEET } from './upload-spreadsheet';



@Injectable()
export class MessageService {

  whatsNeeded = WHATS_NEEDED_TXT;
  reportingPeriod = REPORTING_PERIOD_TXT;
  confirmation = CONFIRMATION_TXT;
  reason = REASON_TXT;
  upload = UPLOAD_SPREADSHEET

  constructor(
    private utils: Utils,
  ) {

  }

  getWhatsNeededText = () => {
    let pageTextObj: any;
    console.log(this.utils.module)
    if (this.whatsNeeded[this.utils.module]) {
      pageTextObj = this.getJSONObject(this.whatsNeeded[this.utils.module]);
    } else if (this.whatsNeeded[this.utils.path]) {
      pageTextObj = this.getJSONObject(this.whatsNeeded[this.utils.path]);
      if (this.whatsNeeded[this.utils.module + '_' + this.utils.path]) {
        pageTextObj = this.getJSONObject(this.whatsNeeded[this.utils.module + '_' + this.utils.path]);
      }
    }
    console.log(pageTextObj, this.utils.path);
    if (this.utils.module === 'dmgpa' || this.utils.module === 'dmgps') {
      if (this.utils.path === 'submit') {
        pageTextObj = this.getJSONObject(this.whatsNeeded['dmgp_submit']);
        return pageTextObj;
      }
      pageTextObj = this.getJSONObject(this.whatsNeeded['dmgp']);
    } else if (pageTextObj && pageTextObj[this.utils.module]) {
      pageTextObj.action_list = pageTextObj[this.utils.module].action_list;
    } else if (pageTextObj && pageTextObj.default && pageTextObj.default.action_list) {
      pageTextObj.action_list = pageTextObj.default.action_list;
    }
    return pageTextObj;
  }

  getReportingPeriodText = () => {
    const pageTextObj: any = this.getJSONObject(this.reportingPeriod);
    if (this.utils.module === 'ms4') {
      pageTextObj.table_column = pageTextObj[this.utils.module + '_' + this.utils.path].table_column;
    } else if (pageTextObj[this.utils.path]) {
      pageTextObj.table_column = pageTextObj[this.utils.path].table_column;
    }
    return pageTextObj;
  }

  getConfirmationText = () => {
    console.log(this.utils.path)
    let pageTextObj: any = this.confirmation[this.utils.path];
    if (pageTextObj && pageTextObj[this.utils.module]) {
      pageTextObj.display_fields = pageTextObj[this.utils.module].display_fields;
      pageTextObj.confirmation_msg = pageTextObj[this.utils.module].confirmation_msg ? pageTextObj[this.utils.module].confirmation_msg : pageTextObj.confirmation_msg;
      pageTextObj.download = pageTextObj[this.utils.module].download ? pageTextObj[this.utils.module].download : pageTextObj.download;
      pageTextObj.confirmation_body = pageTextObj[this.utils.module].confirmation_body ? pageTextObj[this.utils.module].confirmation_body : pageTextObj.confirmation_body;
    } else if (pageTextObj && pageTextObj.default && pageTextObj.default.display_fields) {
      pageTextObj.display_fields = pageTextObj.default.display_fields;
    } else if (this.confirmation[this.utils.module]) {
      pageTextObj = this.getJSONObject(this.confirmation[this.utils.module])
    }
    return pageTextObj;
  }

  getReasonPageText = () => {
    if (this.reason[this.utils.module]) {
      return this.getJSONObject(this.reason[this.utils.module]);
    }
    return this.getJSONObject(this.reason.default);
  }

  getJSONObject = (jsonText) => {
    const jsonString: string = JSON.stringify(jsonText);
    return JSON.parse(jsonString);
  }

}
