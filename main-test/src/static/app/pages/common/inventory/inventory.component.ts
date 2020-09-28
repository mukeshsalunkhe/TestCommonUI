import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Utils } from '../../../shared/Utils';
import { DmrServices } from '../../../services/dmr/dmr.service';
import { MyDeqErrorHandler } from '../../../shared/errorHandler';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MydeqAlertModalComponent } from '../../../shared/modals/alert-modal/alert.component';


@Component({
  selector: 'inventory',
  templateUrl: 'inventory.component.html'
})

export class InventoryComponent implements OnInit {

  @ViewChild(MydeqAlertModalComponent, { static: true }) myAlertModal: MydeqAlertModalComponent;

  preOpenAccordion: string[] = [];
  errorsList: any[] = [];
  deleteConfirmation: boolean;
  model: any = { dmrReqDetailList: [], draftDMRList: [], submittedDMRList: [] };
  placeID: string;
  ltfID: string;
  custId: string;
  sampleDates: string;

  actionText: any = {
    'DRAF': 'EDIT',
    'CERT': 'CERTIFY',
    'SUBM': 'READY TO CERTIFY',
    'PEER': 'UPDATE REPORT',
    'PRVW': 'VIEW',
    'RVWCMP': 'VIEW',
    'NREVSN': 'REVISE REPORT',
    'PEND': 'PENDING',
    'COMP': 'COMPLETED'
  }

  constructor(
    public utils: Utils,
    protected route: ActivatedRoute,
    protected router: Router,
    protected service: DmrServices,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    public activeModal: NgbActiveModal,
    protected errorHandler: MyDeqErrorHandler,
  ) {
    this.utils.reportId = undefined;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.placeID = params['placeId'];
      this.ltfID = params['permitId'];
      this.custId = params['custId'];

      if (!this.ltfID) {
        return;
      }

      this.service.getInventoryList(this.placeID, this.ltfID, this.custId).subscribe(
        response => {
          console.log(response)
          if(response.next_page === 'ALERT') {
            this.myAlertModal.showErrorMessage(this.utils.ALERT.DMR_NOT_REQUIRED);
          }
          this.model.dmrReqDetailList = response.dmrReqDetailList;
          this.model.draftDMRList = response.ltfDmrDetailList.reduce(function (accumulator, currentValue, currentIndex) {
            if (currentValue.status !== 'PEND' && currentValue.status !== 'COMP') {
              currentValue.index = accumulator.length;
              accumulator.push(currentValue)
            }
            return accumulator;
          }, []);
          this.model.submittedDMRList = response.ltfDmrDetailList.filter(report => report.status === 'PEND' || report.status === 'COMP');
        },
        error => {
          this.errorsList = this.errorHandler.getErrors(error);
        }, () => {
          if (this.model.dmrReqDetailList && this.model.dmrReqDetailList.length > 0) {
            this.preOpenAccordion.push('ngb-panel-require');
          }
          if (this.model.draftDMRList && this.model.draftDMRList.length > 0) {
            this.preOpenAccordion.push('ngb-panel-draft');
          }
          if (this.model.submittedDMRList && this.model.submittedDMRList.length > 0) {
            this.preOpenAccordion.push('ngb-panel-submitted');
          }
        });
    });
  }

  deleteReport(globalReqId: string, index: number) {
    this.deleteConfirmation = false;
    this.errorsList = [];
    this.service.deleteReport(globalReqId)
      .subscribe(
        response => {
          if (response) {
            this.deleteConfirmation = true;
            this.model.draftDMRList.splice(index, 1);
          } else {
            this.errorsList.push('An unknown exception has occurred. Please try after sometime.');
          }
        },
        error => {
          this.errorsList = this.errorHandler.getErrorMessage(error);
        });
  }

  reportDMR() {
    this.service.reportDMR(this.placeID, this.ltfID, this.custId).subscribe(
      response => {
        this.utils.path = 'report';
        this.utils.navigateTo('report_type', true, true);
        this.activeModal.close();
      },
      error => {
        if (error.alert_message) {
          this.myAlertModal.showErrorMessage(this.utils.ALERT.DMR_NOT_ALLOWED);
        } else {
          this.errorsList = this.errorHandler.getErrorMessage(error);
        }
      });
  }

  createNewDMR(modal: any) {
    if (this.model.draftDMRList.length > 0) {
      const notNullDates = this.model.draftDMRList.filter(report => report.sampleStartDate);
      const sortByDate = notNullDates.sort(function (a, b) {
        const c: any = new Date(a.sampleStartDate);
        const d: any = new Date(b.sampleStartDate);
        return d - c; // sort by date descending order
      });
      this.sampleDates = sortByDate && sortByDate[0] ? sortByDate[0].sampleStartDate : '';
      this.modalService.open(modal, { centered: true, size: 'lg', backdrop: 'static' });
    } else {
      this.reportDMR();
    }
  }

  actionClick(globalReqId: string, i: string, value: string, status: string) {
    if (status === 'DRAFT' && value === 'edit') {
      window.location.href = '/deq-dmr/service/'+ this.utils.module +'/resumeApp/' + globalReqId;
    } else if (value === 'edit') {
      window.location.href = '/deq-dmr/service/'+this.utils.module+'/resumeApp/' + globalReqId;
    } else if (value === 'download') {
      window.location.href = '/deq-dmr/service/'+this.utils.module+'/resumeDownload/' + globalReqId;
    } else if (value === 'upload') {
      window.location.href = '/deq-dmr/service/'+this.utils.module+'/resumeUpload/' + globalReqId;
    }
  }
}
