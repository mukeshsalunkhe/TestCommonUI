import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, of, Observable, pipe } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Utils } from '../../shared/Utils';
import { environment } from '../../../environments/environment';

const endpoint_url = environment.contextPath;

@Injectable()
export class DmrServices {

  http: HttpClient;
  testMode: boolean;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(http: HttpClient, public utils: Utils) {
    this.http = http;
    this.testMode = environment.testMode;
  }

  getServiceCall(inputServiceName: string = null, serviceURL: string = null): Observable<any> {
    if (this.testMode) {
      return of(this.getMockData(inputServiceName));
    }
    this.utils.showLoading(inputServiceName);
    return this.http
      .get(serviceURL, { observe: 'response' })
      .pipe(
        map((response) => this.extractData(response, true, inputServiceName)),
        catchError((error) => this.handleError(error, true, inputServiceName))
      );
  }

  putServiceCall = (putObj: any, inputServiceName: string = null, serviceURL: string = null): Observable<any> => {
    if (this.testMode) {
      return of(this.getMockData(inputServiceName));
    }
    this.utils.showLoading(inputServiceName);
    putObj = this.utils.trimWhiteSpaceAroundBoundary(putObj);
    return this.http
      .put(serviceURL, putObj, this.httpOptions)
      .pipe(
        map((response) => this.extractData(response, true, inputServiceName)),
        catchError((error) => this.handleError(error, true, inputServiceName))
      );
  }


  getUserDetails() {
    const url = '/mydeq/service/user';
    return this.http
      .get(url)
      .pipe(
        map((response) => this.extractData(response, false)),
        catchError((error) => this.handleError(error, false)));
  }

  getPlaceDetails(placeID) {
    const url = endpoint_url + '/place/detail?placeId=' + placeID;
    return this.http
      .get(url)
      .pipe(
        map((response) => this.extractData(response, false)),
        catchError((error) => this.handleError(error, false)));
  }

  getWhatsNeeded = (placeID, ltfID) => {
    let url = endpoint_url + '/service/' + this.utils.module;
    if (this.utils.module !== 'msgp_19' && this.utils.module !== 'cgp20') {
      url += '/' + this.utils.path;
    }
    url += '/whatsneeded?place_id=' + placeID + '&ltf_id=' + ltfID;
    return this.getServiceCall('whatsneeded', url);
  }

  putWhatsNeeded = () => {
    let url = endpoint_url + '/service/' + this.utils.module;
    if (this.utils.module !== 'msgp_19' && this.utils.module !== 'cgp20') {
      url += '/' + this.utils.path;
    }
    url += '/whatsneeded';
    return this.putServiceCall({}, 'whatsneeded', url);
  }

  getReportingPeriod = () => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/reportingPeriod';
    return this.getServiceCall('reportingPeriod', url);
  }

  putReportingPeriod = (putObj) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/reportingPeriod'
    return this.putServiceCall(putObj, 'reportingPeriod', url);
  }

  getReasonList = () => {
    const url = endpoint_url + '/service/' + this.utils.module + '/nodata/noDataReason';
    return this.getServiceCall('noDataReason', url);
  }

  updateNoDataReason = (putObj) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/nodata/noDataReason'
    return this.putServiceCall(putObj, 'noDataReason', url);
  }

  getUploadDMRSheetPage() {
    let url = endpoint_url + '/service/' + this.utils.module;
    if (this.utils.module !== 'msgp_19' && this.utils.module !== 'cgp20') {
      url += '/upload/spreadSheet';
    } else {
      url += '/upload';
    }
    return this.getServiceCall('noDataReason', url);
  }

  uploadSheet(data) {
    let formData: any = new FormData();
    formData.append('spreadSheetFileName', data.spreadSheetFile ? data.spreadSheetFile.name : null);
    if (data.spreadSheetFile) {
      formData.append('spreadSheetFile', data.spreadSheetFile, data.spreadSheetFile ? data.spreadSheetFile.name : '');
    }
    this.utils.showLoading('uploadSheet');
    let url = endpoint_url + '/service/' + this.utils.module;
    if (this.utils.module !== 'msgp_19' && this.utils.module !== 'cgp20') {
      url += '/upload/spreadSheet';
    } else {
      url += '/upload';
    }
    return this.http
      .post(url, formData)
      .pipe(
        map((response) => this.extractData(response, true, 'uploadSheet')),
        catchError((error) => this.handleError(error, true, 'uploadSheet')));
  }

  getDeficiencyReport = () => {
    const url = endpoint_url + '/service/' + this.utils.module + '/deficiency_report';
    return this.getServiceCall('deficiencyReport', url);
  }

  putDeficiencyReport = (putObj) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/deficiency_report'
    return this.putServiceCall(putObj, 'deficiencyReport', url);
  }

  loadSummary() {
    let url = endpoint_url + '/service/' + this.utils.module;
    if (this.utils.module !== 'msgp_19' && this.utils.module !== 'cgp20') {
      url += '/' + this.utils.path;
    }
    url += '/summary';
    return this.getServiceCall('summary', url);
  }

  putSummary = () => {
    let url = endpoint_url + '/service/' + this.utils.module;
    if (this.utils.module !== 'msgp_19' && this.utils.module !== 'cgp20') {
      url += '/' + this.utils.path;
    }
    url += '/summary';
    return this.putServiceCall({}, 'noDataReason', url);
  }

  getCertifyPage() {
    let url = endpoint_url + '/service/' + this.utils.module;
    if (this.utils.module !== 'msgp_19' && this.utils.module !== 'cgp20') {
      url += '/' + this.utils.path;
    }
    url += '/certify';
    return this.getServiceCall('certify', url);
  }

  putCertifyPage(putObj) {
    let url = endpoint_url + '/service/' + this.utils.module;
    if (this.utils.module !== 'msgp_19' && this.utils.module !== 'cgp20') {
      url += '/' + this.utils.path;
    }
    url += '/certify';
    return this.putServiceCall(putObj, 'noDatacertifyReason', url);
  }

  getConfirmationDetails() {
    let url = endpoint_url + '/service/' + this.utils.module;
    if (this.utils.module !== 'msgp_19' && this.utils.module !== 'cgp20') {
      url += '/' + this.utils.path;
    }
    url += '/confirmation';
    return this.getServiceCall('confirmation', url);
  }

  getGettingStarted() {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/dischargeEventList';
    return this.getServiceCall('getting_started', url);
  }

  putDischargeEventList = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/dischargeEventList';
    return this.putServiceCall(putObj, 'getting_started', url);
  }

  deleteDischargeEventList = (eventId: string) => {
    if (this.testMode) {
      return of(environment.getting_started);
    }
    this.utils.showLoading('deleteDischargeEventList');
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/dischargeEventList/' + eventId;
    return this.http
      .delete(url, this.httpOptions)
      .pipe(
        map((response) => this.extractData(response, true, 'deleteDischargeEventList')),
        catchError((error) => this.handleError(error, true, 'deleteDischargeEventList'))
      );
  }

  getDischargeEventDate() {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/dischargeEventDate';
    return this.getServiceCall('discharge_event_date', url);
  }

  putDischargeEventDate = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/dischargeEventDate';
    return this.putServiceCall(putObj, 'discharge_event_date', url);
  }

  getCreateDischargeEvent() {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/createEvent';
    return this.getServiceCall('create_discharge_event', url);
  }

  putCreateDischargeEvent = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/createEvent';
    return this.putServiceCall(putObj, 'create_discharge_event', url);
  }

  getLogMonitoringDetails(fromPage, eventId) {
    let url = '';
    if (eventId) {
      url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/view_discharge_events/' + fromPage + '/' + eventId;
    } else {
      url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logMonitoringDetails';
    }
    return this.getServiceCall('log_monitoring_details', url);
  }

  putLogMonitoringDetails = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logMonitoringDetails';
    return this.putServiceCall(putObj, 'log_monitoring_details', url);
  }

  deleteMonitoringParam = (idNo: string) => {
    if (this.testMode) {
      return of(environment.getting_started);
    }
    this.utils.showLoading('deleteMonitoringParam');
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logMonitoringDetails/' + idNo;
    return this.http
      .delete(url, this.httpOptions)
      .pipe(
        map((response) => this.extractData(response, true, 'deleteMonitoringParam')),
        catchError((error) => this.handleError(error, true, 'deleteMonitoringParam'))
      )
  }

  getNodiReasonQuestion() {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/nodireasonQ';
    return this.getServiceCall('nodiReasonsQ', url);
  }

  putNodiReasonQuestion = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/nodireasonQ';
    return this.putServiceCall(putObj, 'nodiReasonsQ', url);
  }

  gettDischargeSavedEventList() {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/dischargeSavedEventList';
    return this.getServiceCall('gettDischargeSavedEventList', url);
  }

  putDischargeSavedEventList = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/dischargeSavedEventList';
    return this.putServiceCall(putObj, 'getting_started', url);
  }

  getLogMonitoringQuestionDetails() {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logMonitoringQuestion';
    return this.getServiceCall('log_monitoring_question', url);
  }

  putLogMonitoringQuestionDetails = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logMonitoringQuestion';
    return this.putServiceCall(putObj, 'nodiReasonsQ', url);
  }

  getLogMonitoringLocations() {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logMonitoringLocation';
    return this.getServiceCall('log_monitoring_location', url);
  }

  putLogMonitoringLocation = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logMonitoringLocation';
    return this.putServiceCall(putObj, 'log_monitoring_location', url);
  }

  getReceivingWaterBodies() {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/recievingWaterDetails';
    return this.getServiceCall('recieving_water_details', url);
  }

  putReceivingWaterBodies = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/recievingWaterDetails';
    return this.putServiceCall(putObj, 'recieving_water_details', url);
  }

  getLogVisualMonitoring(fromPage: string, monitorType: string, outfallMonitorId: string) {
    let url = '';
    if (!fromPage) {
      url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logVisualMonitoring';
    } else {
      url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logVisualMonitoring/' + fromPage + '/' + monitorType + '/' + outfallMonitorId;
    }
    return this.getServiceCall('log_visual_monitoring', url);
  }

  putLogVisualMonitoring = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logVisualMonitoring';
    return this.putServiceCall(putObj, 'log_visual_monitoring', url);
  }

  getLogAnalyticalMonitoring(fromPage: string, monitorType: string, outfallMonitorId: string) {
    let url = '';
    if (!fromPage) {
      url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logAnalyticalMonitoring';
    } else {
      url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logAnalyticalMonitoring/' + fromPage + '/' + monitorType + '/' + outfallMonitorId;
    }
    return this.getServiceCall('log_analytical_monitoring', url);
  }

  putLogAnalyticalMonitoring = (putObj: any) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logAnalyticalMonitoring';
    return this.putServiceCall(putObj, 'log_analytical_monitoring_res', url);
  }

  deleteOutfallSampleVisualMs4List = (outfallMonitId: string, sampleDischargeMonitId: string) => {
    if (this.testMode) {
      return of(environment.getting_started);
    }
    this.utils.showLoading('deleteOutfallSampleVisualMs4List');
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logVisualMonitoring/' + outfallMonitId + '/' + sampleDischargeMonitId;
    return this.http
      .delete(url, this.httpOptions)
      .pipe(
        map((response) => this.extractData(response, true, 'deleteOutfallSampleVisualMs4List')),
        catchError((error) => this.handleError(error, true, 'deleteOutfallSampleVisualMs4List')));
  }

  deleteOutfallSampleMs4List = (outfallMonitId: string, sampleMonitType: string) => {
    if (this.testMode) {
      return of(environment.getting_started);
    }
    this.utils.showLoading('deleteOutfallSampleMs4List');
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logMonitoringQuestion/' + outfallMonitId + '/' + sampleMonitType;
    return this.http
      .delete(url, this.httpOptions)
      .pipe(
        map((response) => this.extractData(response, true, 'deleteOutfallSampleMs4List')),
        catchError((error) => this.handleError(error, true, 'deleteOutfallSampleMs4List')));
  }

  deleteOutfallSampleAnalyticalMs4List = (outfallMonitId: string, sampleDischargeMonitId: string) => {
    if (this.testMode) {
      return Observable.throw(environment.getting_started);
    }
    this.utils.showLoading('deleteOutfallSampleAnalyticalMs4List');
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logAnalyticalMonitoring/' + outfallMonitId + '/' + sampleDischargeMonitId;
    return this.http
      .delete(url, this.httpOptions)
      .pipe(
        map((response) => this.extractData(response, true, 'deleteOutfallSampleAnalyticalMs4List')),
        catchError((error) => this.handleError(error, true, 'deleteOutfallSampleAnalyticalMs4List'))
      );
  }


  deleteMs4MonitoringParam = (idNo: string) => {
    if (this.testMode) {
      return of(environment.getting_started);
    }
    this.utils.showLoading('deleteMs4MonitoringParam');
    const url = endpoint_url + '/service/' + this.utils.module + '/' + this.utils.path + '/logAnalyticalMonitoring/' + idNo;
    return this.http
      .delete(url, this.httpOptions)
      .pipe(
        map((response) => this.extractData(response, true, 'deleteMs4MonitoringParam')),
        catchError((error) => this.handleError(error, true, 'deleteMs4MonitoringParam')));
  }

  // MSGP - Service Calls

  getInventoryList = (placeID: string, ltfID: string, custId: string) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + 'inventory?place_id=' + placeID + '&permitId=' + ltfID + '&custId=' + custId;
    return this.getServiceCall('inventory', url);
  }

  reportDMR = (placeID: string, ltfID: string, custId: string) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/inventory?place_id=' + placeID + '&permitId=' + ltfID + '&custId=' + custId
    return this.putServiceCall({}, 'reportDMR', url);
  }

  getHeaderDetails = () => {
    const url = endpoint_url + '/service/' + this.utils.module + '/' + 'dmr_header';
    return this.getServiceCall('dmr_header', url);
  }

  updateStatusToDraft = () => {
    const url = endpoint_url + '/service/' + this.utils.module + '/change_to_draft';
    return this.putServiceCall({}, 'dmr_header', url);
  }

  deleteReport = (globalReqId: string) => {
    if (this.testMode) {
      return of(true);
    }
    this.utils.showLoading('deleteReport');
    const url = endpoint_url + '/service/' + this.utils.module + '/deleteDraftRequest/' + globalReqId;
    return this.http
      .delete(url)
      .pipe(
        map((response) => {
          this.utils.closeLoading('deleteReport');
          return response;
        }),
        catchError((error) => this.handleError(error, true, 'deleteReport'))
      );
  }

  getReportType = (placeID, ltfID) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/report_type?place_id=' + placeID + '&permitId=' + ltfID;
    return this.getServiceCall('report_type', url);
  }

  putReportType = (form) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/report_type'
    return this.putServiceCall(form, 'report_type', url);
  }

  getSampleDate() {
    const url = endpoint_url + '/service/' + this.utils.module + '/sample_date';
    return this.getServiceCall('sample_date', url);
  }

  putSampleDate(form: any) {
    const url = endpoint_url + '/service/' + this.utils.module + '/sample_date'
    return this.putServiceCall(form, 'sample_date', url);
  }

  // putVerifySampleDate(form: any) {
  //   const url = endpoint_url + '/service/' + this.utils.module + '/sample_date_verify'
  //   return this.putServiceCall(form, 'sample_date', url);
  // }

  getNodiCode() {
    const url = endpoint_url + '/service/' + this.utils.module + '/nodi_code';
    return this.getServiceCall('nodi_code', url);
  }

  putNodiCode(form: any) {
    const url = endpoint_url + '/service/' + this.utils.module + '/nodi_code'
    return this.putServiceCall(form, 'report_type', url);
  }

  getSampleCount() {
    const url = endpoint_url + '/service/' + this.utils.module + '/sample_count';
    return this.getServiceCall('sample_count', url);
  }

  putSampleCount(form: any) {
    const url = endpoint_url + '/service/' + this.utils.module + '/sample_count'
    return this.putServiceCall(form, 'sample_count', url);
  }

  getNoDataReason = () => {
    const url = endpoint_url + '/service/' + this.utils.module + '/no_data_reason';
    return this.getServiceCall('no_data_reason', url);
  }

  putNoDataReason = (putObj) => {
    const url = endpoint_url + '/service/' + this.utils.module + '/no_data_reason'
    return this.putServiceCall(putObj, 'no_data_reason', url);
  }

  getSampleMethod() {
    const url = endpoint_url + '/service/' + this.utils.module + '/sample_method';
    return this.getServiceCall('sample_method', url);
  }

  putSampleMethod(form: any) {
    const url = endpoint_url + '/service/' + this.utils.module + '/sample_method'
    return this.putServiceCall(form, 'sample_method', url);
  }

  getDownloadPage() {
    const url = endpoint_url + '/service/' + this.utils.module + '/download';
    return this.getServiceCall('sample_method', url);
  }

  putDownloadPage(form: any) {
    const url = endpoint_url + '/service/' + this.utils.module + '/download'
    return this.putServiceCall(form, 'sample_method', url);
  }


  getHelpDetails(moduleName, path, pageId) {
    let url = '/notices-api/help/' + moduleName;

    if (path) {
      url = url + '/' + path;
    }
    url = url + '/fetchDetails';
    if (pageId) {
      url = url + '?pageId=' + pageId;
    }
    return this.http
      .get(url, { observe: 'response' })
      .pipe(
        map((response) => {
          if (response && response.body) {
            return response.body;
          }
          return response;
        }),
        catchError((error) => { return observableThrowError(error.error); })
      );
  }

  //GIS SERVICE
  async getGisURLS() {
    if (this.testMode) {
      return  of(environment.gisURLS).toPromise();
      //return observableThrowError(environment.gisURLSERR).toPromise();

    }
    this.utils.showLoading('getGisURLS');
    const url = 'service/gisUrls';
    return this.http
      .get(url, { observe: 'response' })
      .pipe(
        map((response) => this.extractData(response, true, 'getGisURLS')),
        catchError((error) => this.handleError(error, true, 'getGisURLS'))
      ).toPromise();
  }

  public handleError(error: HttpErrorResponse, displayLoading = true, callingMethodName: string = null) {
    if (displayLoading) {
      this.utils.closeLoading(callingMethodName);
    }
    return observableThrowError(error.error);
  }

  public extractData(res: HttpResponse<any> | any, displayLoading = true, callingMethodName: string = null) {
    if (displayLoading) {
      this.utils.closeLoading(callingMethodName);
    }
    if (res && res.body) {
      return res.body;
    }
    return res;
  }

  public checkOKResponse(res: HttpResponse<any> | any, displayLoading = true, callingMethodName: string = null) {
    if (displayLoading) {
      this.utils.closeLoading(callingMethodName);
    }
    return (200 === res.status);
  }

  private getMockData(mockDataKey: string) {
    return environment[mockDataKey];
  }
  /********** COMMON Service END  *********/
}


