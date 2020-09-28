export const WHATS_NEEDED_TXT: any = {
     download: {
        'header': 'You will need to know the following to download your myDEQ Data Entry Spreadsheet:',
        'sub_header': 'Please have this information ready and then click CONTINUE.',
        'default': {
            'action_list': [
                    'The reporting period you wish to download',
                    'If reporting no discharge, the appropriate reason for no discharge'
            ],
        },
        'warning_msg' : 'Warning: Your session will time out in 20 minutes of non-activity on a single screen. There is not a save feature in myDEQ at this time. You will need to complete the entire process within the same session.'
    },

    upload: {
        'header': 'You will need the following items to upload your myDEQ Data Entry Spreadsheet:',
        'sub_header': 'Please have this information ready and then click CONTINUE.',
        'default': {
            'action_list': [
                    'myDEQ Data Entry Spreadsheet',
                    'The reporting period you wish to upload'
            ],
        },
        'additional_msg': 'A DMR per your permits requires lab reports, please refer to your permit to know what types of reports you will need.',
        'warning_msg' : 'Warning: Your session will time out in 20 minutes of non-activity on a single screen. There is not a save feature in myDEQ at this time. You will need to complete the entire process within the same session.'
    },
    submit: {
        'header': 'You will need the following items to submit your myDEQ Data Entry Spreadsheet:',
        'sub_header': 'Please have this information ready and then click CONTINUE.',
        'default': {
            'action_list': [
                    'Reporting period',
                    'Data Uploaded to myDEQ'
            ],
        },
        'warning_msg' : 'Warning: Your session will time out in 20 minutes of non-activity on a single screen. There is not a save feature in myDEQ at this time. You will need to complete the entire process within the same session.'
    },
    nodata: {
        'header': 'You will need to know the following to submit your No Data DMR:',
        'sub_header': 'Please have this information ready and then click CONTINUE.',
        'default': {
            'action_list': [
                'Make sure you have no data for your entire section of the facility',
                'The reason why you have no data to report',
                'Which reporting period had no data'
            ],
        },
        'cgp': {
            'action_list': [
                'That you are sure you have no sampling data for the construction site',
                'The reason why you have no data to report',
                'Which reporting period had no data'
            ],
        },
        'warning_msg' : `<div class="mt-3">Warning: Your session will time out after 20 minutes of non-activity on a single screen.</div> <div class="mt-4">Your information is not saved until you reach the screen that has the option to click SAVE & CONTINUE or SAVE & EXIT. Once saved, you can resume at any time by visiting your dashboard.</div>`
    },
    dmgp: {
        'header': 'You will need the following items to log the discharge monitoring result samples for the DMR:',
        'sub_header': 'Please have this information ready and then click CONTINUE.',
        'action_list': [
                'Point of Discharge where the discharge activity was conducted',
                'Discharge start and end dates',
                'Discharge activities conducted',
                'Monitoring results',
                'If NODI, the appropriate reason for no data'
        ],
        'warning_msg' : 'Warning: Your session will time out in 20 minutes of non-activity on a single screen. There is not a save feature in myDEQ at this time. You will need to complete the entire process within the same session.'
    },
    dmgp_submit: {
        'header': 'You will need the following items to submit your electronic DMR:',
        'sub_header': 'Please have this information ready and then click CONTINUE.',
        'action_list': [
                'Data saved to myDEQ',
                'If you have no data for your entire reporting period, the reason why you have no data to report'
        ],
        'warning_msg' : 'Warning: Your session will time out in 20 minutes of non-activity on a single screen. There is not a save feature in myDEQ at this time. You will need to complete the entire process within the same session.'
    },
    ms4: {
        'header': 'The following information is needed to complete the DMR:',
        'sub_header': 'Please have this information ready and then click CONTINUE.',
        'action_list': [
            'Outfall or Field Screening Point Name and Location (latitude/longitude)',
            'Results of Visual Monitoring',
            'Results of Analytical Monitoring, if applicable',
            'If No Discharge (NODI), the appropriate reason for no discharge'
        ],
        'warning_msg' : 'Warning: Your session will time out in 20 minutes of non-activity on a single screen. There is not a save feature in myDEQ at this time. You will need to complete the entire process within the same session.'
    },
    ms4_submit: {
        'header': 'The following items are needed to submit electronic DMR:',
        'sub_header': 'Please have this information ready and then click CONTINUE.',
        'action_list': [
            'Data Saved to myDEQ'
        ],
        'warning_msg' : 'Warning: Your session will time out in 20 minutes of non-activity on a single screen. There is not a save feature in myDEQ at this time. You will need to complete the entire process within the same session.'
    },
    'no_data_dmr': {
        'header': 'You will need the following information to complete this DMR:',
        'action_list': [
            'Wet Season',
            'Reason for No Data',
            'NODI Code'
        ],
        'warning_msg' :  `<div class="mt-3">Warning: Your session will time out after 20 minutes of non-activity on a single screen.</div> <div class="mt-4">Your information is not saved until you reach the screen that has the option to click SAVE & CONTINUE or SAVE & EXIT. Once saved, you can resume at any time by visiting your dashboard.</div>`
    },
    'wet_season': {
        'header': 'You will need the following information to complete this DMR:',
        'action_list': [
            'Sample Date (to determine wet season)',
            'Lab Data Received Date',
            'Type of Sample (grab or composite)',
            'If Composite Samples: duration of flow, number of sub-samples, and time between samples',
            'No Data Indicator Codes (as applicable)'
        ],
        'warning_msg' : 'Warning: Your session will time out in 20 minutes of non-activity on a single screen. Your progress will be saved as you click SAVE & CONTINUE. You can also save your progress (up to the last page of data entered) to your myCOMPLIANCE tab to complete at a later date by clicking SAVE  & EXIT located at the top right of every page.',
    },
    'cgp20_wet_season':{
        'header': 'You will need the following information to complete this process:',
        'action_list': [
        'Date Sample Taken (to determine wet season)',
        'Sample Data',
        'Lab Results Received Date',
        'No Data Indicator Codes (as applicable)'
    ],
    'warning_msg' :  `<div class="mt-3">Warning: Your session will time out after 20 minutes of non-activity on a single screen.</div> <div class="mt-4">Your information is not saved until you reach the screen that has the option to click SAVE & CONTINUE or SAVE & EXIT. Once saved, you can resume at any time by visiting your dashboard.</div>`,
    },
    'acc_monit': {
        'header': 'You will need the following information to complete this DMR:',
        'action_list': [
            'Sample Date (to determine wet season)',
            'Lab Data Received Date',
            'Type of Sample (grab or composite)',
            'If Composite Samples: duration of flow, number of sub-samples, and time between samples',
            'No Data Indicator Codes (as applicable)'
        ],
        'warning_msg' : 'Warning: Your session will time out in 20 minutes of non-activity on a single screen. Your progress will be saved as you click SAVE & CONTINUE. You can also save your progress (up to the last page of data entered) to your myCOMPLIANCE tab to complete at a later date by clicking SAVE  & EXIT located at the top right of every page.'
    },
    'other': {
        'header': 'You will need the following information to complete this DMR:',
        'action_list': [
            'Sample Date (to determine wet season)',
            'Lab Data Received Date',
            'Type of Sample (grab or composite)',
            'If Composite Samples: duration of flow, number of sub-samples, and time between samples',
            'No Data Indicator Codes (as applicable)'
        ],
        'warning_msg' : 'Warning: Your session will time out in 20 minutes of non-activity on a single screen. Your progress will be saved as you click SAVE & CONTINUE. You can also save your progress (up to the last page of data entered) to your myCOMPLIANCE tab to complete at a later date by clicking SAVE  & EXIT located at the top right of every page.'
    },
};
