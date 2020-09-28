import { Component } from '@angular/core';

@Component({

    selector: 'mydeq-alert-modal',
    templateUrl: './alert.component.html'
})
export class MydeqAlertModalComponent {

    alertObj: any = {}
    showAlert: boolean;
    mainButtonCallBack: Function;


    showErrorMessage(alertObj: any) {
        this.alertObj = alertObj;
        this.showAlert = true;
    }

    hideErrorMsg() {
        this.showAlert = false;
        if (this.alertObj.mainButtonText === 'PROCEED' && this.mainButtonCallBack) {
            this.mainButtonCallBack();
        } else if (this.alertObj.mainButtonCTA) {
          window.open(this.alertObj.mainButtonCTA, '_self');
        }
    }

    closeErrorMsg() {
        this.showAlert = false;
        if (this.alertObj.leftButtonCTA) {
          window.open(this.alertObj.leftButtonCTA, '_self');
        }
    }

     /**
     * To be called for displaying modal with 'RETURN TO myStuff' & 'CANCEL' buttons.
     * @param alertObj - Alert object.
     * @example - showCustomModal('In correct details.','Please specify correct details.','CANCEL','OK',()=>{//call back code})
     * 
     */
    showCustomModal(errorTitle: string, errorMsg: string, leftBtnTxt: string, rightBtnTxt: string, mainCallback: Function, leftButtonCallBack?: Function) {
        this.alertObj = {
            title: errorTitle,
            msg: errorMsg,
            mainButtonText: rightBtnTxt,
            leftButtonText: leftBtnTxt,
            leftButtonCallBack: leftButtonCallBack
        };
        this.mainButtonCallBack = mainCallback;
        this.showAlert = true;
    }

}
