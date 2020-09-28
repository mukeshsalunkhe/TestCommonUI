import { Injectable, ErrorHandler} from '@angular/core';


@Injectable()
export class MyDeqErrorHandler implements ErrorHandler {

    handleError(error: any) {
        console.log('Exception : ', error);
    }

    getErrors(dataStr) {
        const messages: any[] = [];
        if (!dataStr || dataStr === '') {
            messages.push('An unknown exception has occurred. Please try after sometime');
            return messages;
        }

        let data;
        if (!(dataStr instanceof Object)) {
            try {
            data = JSON.parse(dataStr);
            } catch (e) {
                messages.push(dataStr);
                return messages;
            }
        } else {
            data = dataStr;
        }

        if (data.system_error && data.system_error.length) {
            data.system_error.forEach((error) => {
                if (error.error_message !== null) {
                    messages.push(<string>error.error_message);
                } else {
                    messages.push(<string>error.error_code);
                }
            });
        }

        if (data.error_code_list && data.error_code_list.length) {
            data.error_code_list.forEach((error) => {
                if (error.error_message !== null) {
                    messages.push(error.error_message);
                } else {
                    messages.push(error.error_code);
                }
            });
        }

        // if messages and fields are both null, data itself is the error message
        if (data.alert_message) {
            messages.push(data.alert_message);
        }

        if (!messages.length) {
            messages.push('An unknown exception has occurred. Please try after sometime');
        }

        return messages;
    }

    getErrorFields(dataStr) {

        let fields: any[] = [];
        if (!dataStr || dataStr === '') {
          return fields;
        }

        let data;

        if (!(dataStr instanceof Object)) {
            try {
                data = JSON.parse(dataStr);
            } catch (e) {
                return fields;
            }
        } else {
            data = dataStr;
        }

        if (data.error_fields && data.error_fields.length) {
            data.error_fields.forEach((errorField) => {
                fields[errorField.field_id] = true;
            });
        }
        return fields;
    }

    getErrorMessage(errorStr) {
        if (!errorStr || errorStr === '') {
          return null;
        }
        let error;
        if (!(errorStr instanceof Object)) {
            try {
                error = JSON.parse(errorStr);
                return error.alert_message;
            } catch (e) {
                return '';
            }
        } else {
            return errorStr.alert_message;
        }
    }
}
