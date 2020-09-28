
export const environment = {
  production: true,
  testMode: false,
  contextPath: '/deq-dmr',
   
  whatsneeded: { "error_fields": null, "system_error": null, "error_code_list": null, "next_page": null, "previous_page": null, "dmrInd": "", "validAppInd": "Y" ,"validAccessInd":"N"},
  reportingPeriod: { "error_fields": null, "system_error": null, "error_code_list": null, "next_page": null, "previous_page": "WHATS_NEEDED", "alert_message": null, "reportingPeriods": [{ "reportingCycle": "Annual Report 2016", "reportingProgress": "25", "reportingCycleId": "0", "reportingStatusText": "DOWNLOADED 06/02/2017", "reportingStatusDate": "2017-06-02 11:51:35.0", "reportingStatus": "DOWNLOADED", "disabledStatusCode": "D", "reportingStartDate": "06/01/2016", "reportingEndDate": "05/31/2017", "reportingDueDate": "07/15/2017", "reportingFrequency": "ONCE A YEAR", "errorStatus": "0", "isExpired": null }, { "reportingCycle": "Annual Report 2017", "reportingProgress": "0", "reportingCycleId": "0", "reportingStatusText": null, "reportingStatusDate": null, "reportingStatus": null, "disabledStatusCode": null, "reportingStartDate": "06/01/2017", "reportingEndDate": "05/31/2018", "reportingDueDate": "07/15/2018", "reportingFrequency": "ONCE A YEAR", "errorStatus": "0", "isExpired": null }], "selectedCycleId": null, "selectedCycleText": null },
  noDataReason: { "error_fields": null, "system_error": null, "error_code_list": null, "next_page": null, "previous_page": "REPORTING_PERIOD", "alert_message": null, "noDataReasonList": [{ "reasonId": "8", "reasonText": "Other (See Comments) **Comments Required" }, { "reasonId": "9", "reasonText": "Inactive/ Unstaffed Site" }, { "reasonId": "C", "reasonText": "No discharge" }, { "reasonId": "K", "reasonText": "Natural Disaster" }, { "reasonId": "N", "reasonText": "Not Constructed" }], "selectedReasonId": "N", "selectedReasonText": null, "selectedReasonComment": "test" },
  summary: { "error_fields": null, "system_error": null, "error_code_list": null, "next_page": null, "previous_page": "NO_DATA_REASON", "alert_message": null, "answeredPageMap": { "REPORTING_PERIOD": { "error_fields": null, "system_error": null, "error_code_list": null, "next_page": null, "previous_page": "WHATS_NEEDED", "alert_message": null, "reportingPeriods": [{ "reportingCycle": "Annual Report 6-01 00:00:00.0", "reportingProgress": "100", "reportingCycleId": "0", "reportingStatusText": "SUBMITTED 2017-05-05 16:14:56.0", "reportingStatusDate": "2017-05-05 16:14:56.0", "reportingStatus": "SUBMITTED", "disabledStatusCode": "Y", "reportingStartDate": "2016-06-01 00:00:00.0", "reportingEndDate": "2017-05-31 00:00:00.0", "reportingDueDate": "07/15/2017", "reportingFrequency": "ONCE A YEAR", "errorStatus": "0", "isExpired": null }], "selectedCycleId": "0", "selectedCycleText": "Annual Report 6-01 00:00:00.0" }, "NO_DATA_REASON": { "error_fields": null, "system_error": null, "error_code_list": null, "next_page": null, "previous_page": "REPORTING_PERIOD", "alert_message": null, "noDataReasonList": [{ "reasonId": "8", "reasonText": "Other (See Comments) **Comments Required" }, { "reasonId": "9A", "reasonText": "Inactive/ Unstaffed Site" }, { "reasonId": "9B", "reasonText": "Benchmark/ General Analytical sampling completed for permit term." }, { "reasonId": "9C", "reasonText": "Impaired or Not-Attaining Waters sampling completed for permit term" }, { "reasonId": "9D", "reasonText": "Ephemeral water monitoring exception" }, { "reasonId": "C", "reasonText": "No discharge" }, { "reasonId": "K", "reasonText": "Natural Disaster" }, { "reasonId": "N", "reasonText": "Not Constructed" }], "selectedReasonId": "9C", "selectedReasonText": "Impaired or Not-Attaining Waters sampling completed for permit term", "selectedReasonComment": "sdf" } } },
  certify: { "error_fields": null, "system_error": null, "error_code_list": null, "next_page": "CONFIRMATION", "previous_page": "SUMMARY", "alert_message": null, "challengeQuestion": { "question": "In what city did you meet your spouse/significant other?", "questionSetId": "http://wso2.org/claims/challengeQuestion1" }, "chkClarifyStatement": false, "message": [{ "heading": "<h2>Certify your submission:</h2>", "text": "<p>By checking this box I certify under penalty of law that this submittal was prepared by me, or under my direction or supervision of personnel appropriately qualified to properly gather and evaluate the information submitted. The information submitted is, to the best of my knowledge and belief, true, accurate, and complete. I understand that all information submitted to ADEQ is public record unless otherwise identified by law as confidential. I am aware that there are significant penalties for submitting false information, including the possibility of fines and imprisonment for knowing violations.</p >" }], "mydeqContactAddress": null, "noOfAttempt": 0, "accountLocked": false },
  confirmation: { "error_fields": null, "system_error": null, "error_code_list": null, "next_page": null, "previous_page": "SUMMARY", "alert_message": null, "dmrConfirmation": { "placeName": "MY PALACE", "ltfId": "65729", "todaysDate": "05/09/2017", "rptName": "Annual Report 2016", "rptStartDate": "01-Jun-2016", "rptEndDate": "31-May-2017" } },
  getting_started: {"error_fields":null,"system_error":null,"error_code_list":null,"next_page":null,"previous_page":"WHATS_NEEDED","alert_message":null,"dischargeEventList":[{"eventId":"1","eventName":"First Event","outfallName":"Scottsdale","dischargeStartDate":"06/02/2017","dischargeEndDate":"06/12/2017","status":"Saved"},{"eventId":"2","eventName":"Second Event","outfallName":"0","dischargeStartDate":"06/02/2017","dischargeEndDate":"06/12/2017","status":"Draft"}],"booleanAnswer":null},
  discharge_event_date : {"error_fields":null,"system_error":null,"error_code_list":null,"next_page":null,"previous_page":null,"alert_message":null,"alert_header":null,"dischargeEvent":{"outfallId":null,"outfallName":null,"eventId":null,"dischargeStartDate":null,"dischargeEndDate":null,"status":null},"outfalls":[{"outfallId":"1","outfallName":"sachin"},{"outfallId":"3","outfallName":"roja"},{"outfallId":"19","outfallName":"vija"},{"outfallId":"12","outfallName":"pandya"},{"outfallId":"133","outfallName":"udya"}]},
  create_discharge_event : {"error_fields":null,"system_error":null,"error_code_list":null,"next_page":null,"previous_page":null,"alert_message":null,"alert_header":null,"dischargeEvent":{"outfallId":"2","outfallName":"Satara - MH 11","eventId":null,"dischargeStartDate":"12/12/2014","dischargeEndDate":"13/12/2014","status":null},"outfalls":null,"dischargeActivities":[{"code":"1","description":"1-discharge activity","subDischargeActivities":[{"code":"123","description":"1-okok"},{"code":"133","description":"1-Sachin"},{"code":"122","description":"1-Tendulake"}]},{"code":"2","description":"2-discharge activity","subDischargeActivities":[{"code":"233","description":"2-Sachin"},{"code":"244","description":"2-Tendulake"}]},{"code":"3","description":"3-discharge activity","subDischargeActivities":[{"code":"333","description":"3-Sachin"},{"code":"344","description":"3-Tendulake"},{"code":"355","description":"3-ttt"},{"code":"366","description":"3-fff"}]}],"userSelectedDischargeActivities":null},
  log_monitoring_details :{"error_fields":null,"system_error":null,"error_code_list":null,"next_page":null,"previous_page":null,"alert_message":null,"alert_header":null,"dischargeEvent":{"outfallId":"11","outfallName":"outFaASSASAddaasfasfafafadafadasdasefsfasfsgsdgsdgsdfgll Name","eventId":"myFirst","dischargeStartDate":"12/12/2013","dischargeEndDate":"12/24/2014","status":null,"strDischargeActivities":["ABC - 123","Check - 98iskjs llljlj "]},"dmgpExcelSheetDatas":[{"monitoringPointId":null,"monitoringPointName":null,"storet":null,"parameterName":"Sachin T","parameterId":"123","swqs":null,"unit":"mgl","frequency":null,"resIdno":null,"sampleRequired":null,"hardnessRequired":"Y","phRequired":"Y","temperatureRequired":"Y","swqsFormula":null,"monitoringNodiCode":null,"monitoringNodiComments":null,"parameterNodiCode":"OK","parameterNodiComments":null,"sampleDate":null,"hardness":"","ph":"","temperature":"","upstream":null,"downstream":null,"uploadComments":null,"concRpt":null,"uploadErrorList":null,"sampleEnteredDate":"12/12/1221","eventLogId":null,"optionalIndicator":"N","parameterLimit":null,"sampleValue":"121"},{"monitoringPointId":null,"monitoringPointName":null,"storet":null,"parameterName":"Sachin T","parameterId":"123","swqs":null,"unit":"mgl","frequency":null,"resIdno":null,"sampleRequired":null,"hardnessRequired":"N","phRequired":"Y","temperatureRequired":"N","swqsFormula":null,"monitoringNodiCode":null,"monitoringNodiComments":null,"parameterNodiCode":"OK","parameterNodiComments":null,"sampleDate":null,"hardness":"","ph":"","temperature":"","upstream":null,"downstream":null,"uploadComments":null,"concRpt":null,"uploadErrorList":null,"sampleEnteredDate":"12/12/1221","eventLogId":null,"optionalIndicator":"N","parameterLimit":null,"sampleValue":"121"},{"monitoringPointId":null,"monitoringPointName":null,"storet":null,"parameterName":"Sachin T","parameterId":"123","swqs":null,"unit":"mgl","frequency":null,"resIdno":null,"sampleRequired":null,"hardnessRequired":"N","phRequired":"N","temperatureRequired":"Y","swqsFormula":null,"monitoringNodiCode":null,"monitoringNodiComments":null,"parameterNodiCode":"OK","parameterNodiComments":null,"sampleDate":null,"hardness":"","ph":"","temperature":"","upstream":null,"downstream":null,"uploadComments":null,"concRpt":null,"uploadErrorList":null,"sampleEnteredDate":"12/12/1221","eventLogId":null,"optionalIndicator":"N","parameterLimit":null,"sampleValue":"121"}]},
  nodiReasonsQ:{"error_fields":null,"system_error":null,"error_code_list":null,"next_page":null,"previous_page":"CONFIRM_TERMINATE","alert_message":null,"alert_header":null,"comments":"","userNodiCode":"","booleanAnswer":null,"noDataReasons":[{"reasonId":"1","reasonText":"Regulated industrial activities are no longer conducted at the facility and all materials,products, and waste products have been removed from the facility"},{"reasonId":"2","reasonText":"A new owner or operator has taken over responsibility for the facility"},{"reasonId":"3","reasonText":"This facility now has a No Exposure Certification (NEC) "},{"reasonId":"4","reasonText":"Coverage has been obtained for this site under an individual or alternative general permit for all discharges required to be covered by an AZPDES permit."}]},
  log_monitoring_detailsERR:{},
  log_monitoring_details_001:{},
  gettDischargeSavedEventList:{},
  log_monitoring_question:{},
  recieving_water_details:{},
  log_visual_monitoring:{},
  log_analytical_monitoring:{},
  log_analytical_monitoring_res:{},
  log_monitoring_location:{},
  ms4_summary:{},
  gisURLS:{}


};