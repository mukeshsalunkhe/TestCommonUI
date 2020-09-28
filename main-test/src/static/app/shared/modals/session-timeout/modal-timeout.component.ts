import { Component, NgZone } from '@angular/core';
import { LogoutService } from '../../../services/logout.service';

@Component({
    selector: 'mydeq-session-timeout',
    templateUrl: 'modal-timeout.component.html'
})
export class SessionTimeOutModalComponent {
    sessionTimedOut = false;
    timeoutMessageIsVisible: boolean;
    private timeout =  1200000;     // 20m
    private warnTime = 1080000;     // 20m - 118s(countdown) - 2m(buffer)
    private timer: any;

    constructor(
        private service: LogoutService
    ) { }

    init() {
        this.initWatcher(() => {
            this.showWarnTimeoutModal();
        }, this.warnTime)
    }

    initWatcher(action, timeout) {
        this.timer = setTimeout(() => {
            action() // warn/disconnect user}, timeout);
        }, timeout)
    }

    extentSession () {
        clearTimeout(this.timer);
        this.init();
    }

    showWarnTimeoutModal() {
        this.sessionTimedOut = false;
        this.timeoutMessageIsVisible = true;
        const diffTime: number = this.timeout - this.warnTime;
        this.initWatcher(() => {
            this.showTimeoutModal();
        }, diffTime)
    }

    showTimeoutModal() {
        this.sessionTimedOut = true;
        this.timeoutMessageIsVisible = true;
        this.service.logoutMe(true);
    }

    continueSession() {
        clearTimeout(this.timer);
        this.timeoutMessageIsVisible = false;
        this.initWatcher(() => {
            this.showWarnTimeoutModal();
        }, this.warnTime)
    }

    endSession() {
        window.open('logout', '_self');
    }
}
