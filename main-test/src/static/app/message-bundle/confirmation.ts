export const CONFIRMATION_TXT: any = {
  download: {
    'confirmation_msg': 'Thank you for creating a myDEQ Data Entry Spreadsheet*. Your spreadsheet is now ready to download by clicking on the icon. <br /><br /> After completing the spreadsheet, return to myDEQ for Step 2: Upload Spreadsheet.',
    'download': [{
      'doc_type': 'XL',
      'doc_label': 'DMR Spreadsheet'
    }
    ]
  },
  nodata: {
    cgp: {
      'display_fields': [
        {
          'displayName': 'Construction Site:',
          'serviceKey': 'placeName'
        },
        {
          'displayName': 'LTF #:',
          'serviceKey': 'ltfId'
        },
        {
          'displayName': 'Date submitted:',
          'serviceKey': 'todaysDate'
        },
        {
          'displayName': 'Reporting Period:',
          'serviceKey': 'rptName'
        },
        {
          'displayName': 'Dates of Reporting Period:',
          'serviceKey': 'rptPeriod'
        }
      ],
    },
    default: {
      'display_fields': [
        {
          'displayName': 'Facility:',
          'serviceKey': 'placeName'
        },
        {
          'displayName': 'LTF #:',
          'serviceKey': 'ltfId'
        },
        {
          'displayName': 'Date submitted:',
          'serviceKey': 'todaysDate'
        },
        {
          'displayName': 'Reporting Period:',
          'serviceKey': 'rptName'
        },
        {
          'displayName': 'Dates of Reporting Period:',
          'serviceKey': 'rptPeriod'
        }
      ],
    },

    'confirmation_msg': 'You will be emailed a copy of your DMR report within 24 hours.',
  },
  upload: {
    'confirmation_msg': 'Your spreadsheet has been successfully uploaded.<br>The Responsible Corporate Officer (RCO) / Delegated Responsible Officer (DRO) for this account has been emailed a copy of this uploaded DMR.<br><br>Once reviewed the RCO / DRO will need to return to myDEQ and choose Step 3: Submit DMR to certify and complete the submission process.'
  },
  submit: {
    cgp: {
      'display_fields': [
        {
          'displayName': 'Construction Site:',
          'serviceKey': 'placeName'
        },
        {
          'displayName': 'LTF #:',
          'serviceKey': 'ltfId'
        },
        {
          'displayName': 'Date submitted:',
          'serviceKey': 'todaysDate'
        },
        {
          'displayName': 'Reporting Period:',
          'serviceKey': 'rptName'
        },
        {
          'displayName': 'Dates of Reporting Period:',
          'serviceKey': 'rptPeriod'
        }
      ],
    },
    dmgpa: {
      'confirmation_body': 'Your DMR has been submitted',
      'display_fields': [
        {
          'displayName': 'LTF #:',
          'serviceKey': 'ltfId'
        },
        {
          'displayName': 'Date submitted:',
          'serviceKey': 'todaysDate'
        }
      ],
      'download': [
        {
          'doc_type': 'PDF',
          'doc_label': 'COPY OF RECORD'
        }
      ],
      'confirmation_msg': ' '
    },
    dmgps: {
      'confirmation_body': 'Your DMR has been submitted',
      'display_fields': [
        {
          'displayName': 'LTF #:',
          'serviceKey': 'ltfId'
        },
        {
          'displayName': 'Date submitted:',
          'serviceKey': 'todaysDate'
        }
      ],
      'download': [
        {
          'doc_type': 'PDF',
          'doc_label': 'COPY OF RECORD'
        }
      ],
      'confirmation_msg': ' '
    },
    ms4: {
      'confirmation_body': 'Your DMR has been submitted',
      'display_fields': [
        {
          'displayName': 'AZPDES NO:',
          'serviceKey': 'ltfId'
        },
        {
          'displayName': 'Date submitted:',
          'serviceKey': 'todaysDate'
        }
      ],
      'download': [
        {
          'doc_type': 'PDF',
          'doc_label': 'COPY OF RECORD'
        }
      ],
      'confirmation_msg': ' '
    },
    default: {
      'display_fields': [
        {
          'displayName': 'Facility:',
          'serviceKey': 'placeName'
        },
        {
          'displayName': 'LTF #:',
          'serviceKey': 'ltfId'
        },
        {
          'displayName': 'Date submitted:',
          'serviceKey': 'todaysDate'
        },
        {
          'displayName': 'Reporting Period:',
          'serviceKey': 'rptName'
        },
        {
          'displayName': 'Dates of Reporting Period:',
          'serviceKey': 'rptPeriod'
        }
      ],
    },
    'confirmation_msg': 'You will be emailed a copy of your DMR report within 24 hours.'
  },
  'msgp_19': {
    'confirmation_body': 'Your DMR has been submitted. ADEQ will review your report and will notify you if any followup actions are needed. <br /> <br /> Please click the icon to the right to save/print your Copy of Record of the submitted DMR. You will be emailed a copy of your report within 24 hours.',
    'download': [{
      'doc_type': 'PDF',
      'doc_label': 'Copy of Record'
    }],
    'display_fields': [
      {
        'displayName': 'Facility:',
        'serviceKey': 'placeName'
      },
      {
        'displayName': 'LTF #:',
        'serviceKey': 'ltfId'
      },
      {
        'displayName': 'Date submitted:',
        'serviceKey': 'todaysDate'
      },
      {
        'displayName': 'Reporting Id:',
        'serviceKey': 'azpdesNo'
      }
    ]
  },
  'cgp20': {
    'confirmation_body': 'Thank you for submitting your DMR. If there are any required follow-up actions for this DMR, ADEQ will notify you within the next 30 business days.',
    'download': [{
      'doc_type': 'PDF',
      'doc_label': 'Copy of Record'
    }],
    'display_fields': [
      {
        'displayName': 'Date submitted:',
        'serviceKey': 'todaysDate'
      },
      {
        'displayName': 'Report ID:',
        'serviceKey': 'reportId'
      },
    ]
  },

};
