import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RoutesRecognized, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

// import { Angulartics2Piwik } from 'angulartics2/piwik';
import { Utils } from './shared/Utils';
import { DmrServices } from './services/dmr/dmr.service';
import { MyDeqErrorHandler } from './shared/errorHandler';

import { SessionTimeOutModalComponent } from './shared/modals/session-timeout/modal-timeout.component';
import { NeedHelpComponent } from './shared/libs/need-help/need-help.component';

// declare var _paq: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild(SessionTimeOutModalComponent, { static: true }) sessionTimeoutModal: SessionTimeOutModalComponent;
  @ViewChild(NeedHelpComponent, { static: true }) helpLayer: NeedHelpComponent;

  pageTitle: string;
  isPlaceBarRequired: boolean | null;
  pageClass = 'default-page';
  showSaveAndExit: boolean;

  constructor(
    public utils: Utils,
    private titleService: Title,
    // private piwik: Angulartics2Piwik,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: DmrServices,
    private errorHandler: MyDeqErrorHandler

  ) {
    // piwik.startTracking();
    // if (_paq) {
    //   _paq.push(['setSiteId', utils.getPiwikSiteId(window.location.hostname)]);
    // }
    (async  () => {
      if(!this.utils.mapUrl){
        try{
          let gisData = await this.service.getGisURLS();
          this.utils.mapUrl = gisData.propertyMap;
        }catch(e){
          console.error('PLACE: ERROR while fetching GIS data.')
        }
      }
    })();
    router.events.subscribe(e => {
      if (e instanceof RoutesRecognized) {
        const routeParentObj = e.state.root.firstChild;
        const routeChildObj = routeParentObj.firstChild;
        if (!routeChildObj) {
          return;
        }
        const data: any = routeChildObj.firstChild ? routeChildObj.firstChild.data : routeChildObj.data;
        this.pageTitle = 'DMR :: ' + data.title;
        titleService.setTitle(this.pageTitle);
        utils.module = utils.module ? utils.module : routeParentObj.url[0].path;
        utils.path = utils.path ? utils.path : routeParentObj.url[1] ? routeParentObj.url[1].path : undefined;
        if (!utils.path) {
          utils.path = routeChildObj.url[0] ? routeChildObj.url[0].path : undefined;
        }
        this.isPlaceBarRequired = data.placeBarRequired
        if (this.isPlaceBarRequired) {
          this.initPlaceBar();
        }
        utils.title = utils.TITLE_ENUM[utils.path];
        if (utils.path === 'upload' && (utils.module === 'dmgpa' || utils.module === 'dmgps')) {
          utils.title = 'LOG DISCHARGE MONITORING DETAILS';
        } else if (utils.module === 'ms4') {
          utils.title = 'AZPDES SMALL MS4 DISCHARGE MONITORING REPORT';
        } else if (utils.module === 'msgp_19' && utils.path === 'inventory') {
          utils.title = 'MSGP DISCHARGE MONITORING REPORT (DMR) INVENTORY';
          utils.path = undefined;
          this.showSaveAndExit = false;
        } else if (utils.module === 'msgp_19') {
          utils.title = 'MSGP DMR';
          this.showSaveAndExit = true;
        } else if (utils.module === 'cgp20') {
          if(utils.path === 'inventory') {
            utils.title = "CGP DISCHARGE MONITORING REPORT (DMR) INVENTORY"
            this.showSaveAndExit = false;
          } else {
            utils.title = "CGP DISCHARGE MONITORING REPORT (DMR)"
              this.showSaveAndExit = data.showSaveAndExit;  
            
              
          }
          
        } 
        else if (!utils.title) {
          utils.title = 'SOMETHING WENT WRONG';
        }
      } else if (e instanceof NavigationEnd) {
        // if (_paq) {
        //   _paq.push(['setDocumentTitle', this.pageTitle]);
        //   piwik.pageTrack(window.location.href, window.location);
        // }
        if (this.sessionTimeoutModal) {
          this.sessionTimeoutModal.extentSession();
        }
      }
    });

  }

  ngOnInit() {
    if (!this.utils.userDetails.first_name) {
      this.service.getUserDetails().subscribe(
        response => {
          this.utils.userDetails = response;
        },
        error => {
          //console.log(error);
        });
    }
  }

  ngAfterViewInit() {
    this.sessionTimeoutModal.init();
  }

  initPlaceBar() {
    if (this.utils.placeName) {
      return;
    }
    let placeID: number | null;

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      placeID = params['placeId'];
      if (!placeID) {
        return;
      }
      this.utils.placeID = placeID;
      this.utils.ltfID = params['permitId'];
      this.service
        .getPlaceDetails(placeID).subscribe(
          receivedResponse => {
            if (receivedResponse.portPlaceName) {
              this.utils.placeName = receivedResponse.portPlaceName;
            } else if (receivedResponse.placeAltName) {
              this.utils.placeName = receivedResponse.placeAltName;
            } else {
              this.utils.placeName = receivedResponse.placeName;
            }
            this.utils.placeAddress = this.utils.getCompletePlacebarAddress(receivedResponse.address);
            this.utils.placeBarObj = receivedResponse;
          },
          error => {
            /* Ignored error */
            this.utils.placeName = null;
            this.utils.placeAddress = null;
          });
    });
  }

  saveAndExit = () => {
    this.utils.gotoCompliance();
  }

  showNeedHelp() {
    const moduleList = { dmgps: 'dmgp', dmgpa: 'dmgp', msgp_19: 'msgp' };
    const moduleName = moduleList[this.utils.module] ? moduleList[this.utils.module] : this.utils.module;
    this.helpLayer.loadHelp(moduleName, 'DMR', null);
  }
}
