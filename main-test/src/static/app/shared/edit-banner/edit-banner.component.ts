import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Utils } from '../Utils';
import { MyDeqErrorHandler } from '../errorHandler';
import { DmrServices } from '../../services/dmr/dmr.service';

@Component({
  selector: 'edit-banner',
  templateUrl: 'edit-banner.component.html'
})

export class EditBannerComponent {

  @Input() glbRequestId: string;
  @Output() updateEditIndicator = new EventEmitter<any>();
  editClicked: boolean;

  constructor(
    protected utils: Utils,
    protected service: DmrServices,
    protected errorHandler: MyDeqErrorHandler) {
  }

  updateStatus() {
    this.service.updateStatusToDraft().subscribe(
      response => {
        this.updateEditIndicator.emit({ enabled: true });
        this.editClicked = true;
      },
      error => { });
  }
}
