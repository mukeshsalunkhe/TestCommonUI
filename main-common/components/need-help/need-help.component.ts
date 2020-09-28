import { Component } from '@angular/core';
import { NgbAccordionConfig, NgbActiveModal, NgbPanelChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalService } from '../../service/global.service';


@Component({
    selector: 'app-need-help',
    templateUrl: 'need-help.component.html',
    providers: [NgbAccordionConfig, NgbActiveModal]
})

export class NeedHelpComponent {

    faqs: any;
    videos: any;
    contactDetails: any;
    resourceDetails: any;
    showHelp: boolean;
    serviceCalled: boolean;

    constructor(
        private service: GlobalService,
        private accordionConfig: NgbAccordionConfig,
    ) { }

    loadHelp(moduleName, path, pageId) {
        this.getHelpDetails(moduleName, path, pageId);
        this.showHelp = true;
        this.serviceCalled = false;
    }

    getHelpDetails(moduleName, path, pageId) {
        this.service.getHelpDetails(moduleName, path, pageId).subscribe(
            response => {
                const res = response as any;
                this.faqs = res.faqList;
                this.videos = res.videoList;
                this.contactDetails = res.contactDetailList;
                this.resourceDetails = res.resourceList;
                this.serviceCalled = true;
            },
            error => {
                this.serviceCalled = true;
            });
    }

    public beforeChange($event: NgbPanelChangeEvent) {
        const panelId = $event.panelId;
        if ($event.nextState) {
            document.getElementById('square-' + panelId).className = 'fa fa-lg fa-minus-square-o';
        } else {
            document.getElementById('square-' + panelId).className = 'fa fa-lg fa-plus-square-o';
        }
    }

    close() {
        this.showHelp = false;
    }
}

