import { Component, Input, OnChanges, SimpleChange } from "@angular/core";
import { DataTable } from "./DataTable";
import { Paginator } from "./Paginator";
import * as _ from "lodash";

@Component({
    selector: "mfBootstrapPaginator",
    template: `
   <mfPaginator #p [mfTable]="mfTable">
      <ul class="pagination float-left mb-0" *ngIf="p.dataLength > p.rowsOnPage">     
            <li class="page-item" *ngIf="p.activePage > 4 && p.activePage + 1 > p.lastPage" (click)="p.setPage(p.activePage - 4)">
                <a class="page-link" style="cursor: pointer" [ngClass]="{'bg-danger':isPageHaveError(p,p.activePage-4)}">{{p.activePage-4}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage > 3 && p.activePage + 2 > p.lastPage " (click)="p.setPage(p.activePage - 3)">
                <a class="page-link" style="cursor: pointer" [ngClass]="{'bg-danger':isPageHaveError(p,p.activePage-3)}">{{p.activePage-3}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage > 2  " (click)="p.setPage(p.activePage - 2)">
                <a class="page-link" style="cursor: pointer" [ngClass]="{'bg-danger':isPageHaveError(p,p.activePage-2)}">{{p.activePage-2}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage > 1  " (click)="p.setPage(p.activePage - 1)">
                <a class="page-link" style="cursor: pointer" [ngClass]="{'bg-danger':isPageHaveError(p,p.activePage-1)}">{{p.activePage-1}}</a>
            </li>
            <li class="page-item active">
                <a class="page-link" style="cursor: pointer" [ngClass]="{'bg-danger':isPageHaveError(p,p.activePage)}">{{p.activePage}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage + 1 <= p.lastPage" (click)="p.setPage(p.activePage + 1)">
                <a class="page-link" style="cursor: pointer" [ngClass]="{'bg-danger':isPageHaveError(p,p.activePage+1)}">{{p.activePage+1}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage + 2 <= p.lastPage" (click)="p.setPage(p.activePage + 2)">
                <a class="page-link" style="cursor: pointer" [ngClass]="{'bg-danger':isPageHaveError(p,p.activePage+2)}">{{p.activePage+2}}</a>
            </li>
            <li class="page-item" *ngIf="p.activePage + 3 <= p.lastPage && p.activePage < 3" (click)="p.setPage(p.activePage + 3)">
                <a class="page-link" style="cursor: pointer" [ngClass]="{'bg-danger':isPageHaveError(p,p.activePage+3)}">{{p.activePage+3}}</a>
            </li>
            <li class="page-link" class="page-item" *ngIf="p.activePage + 4 <= p.lastPage && p.activePage < 2" (click)="p.setPage(p.activePage + 4)">
                <a class="page-link" style="cursor: pointer" [ngClass]="{'bg-danger':isPageHaveError(p,p.activePage+4)}">{{p.activePage+4}}</a>
            </li>
            <li class="page-link" class="page-item" *ngIf="p.lastPage > 5" class="boundaryLinks" (click)="p.setPage(p.lastPage)">
                <a class="page-link" style="cursor: pointer" [ngClass]="{'bg-danger':isPageHaveError(p,p.lastPage)}">/ {{p.lastPage}}</a>
            </li>
            <li class="page-item" [class.disabled]="p.activePage <= 1" (click)="p.setPage(p.activePage - 1)">
                <a class="page-link" style="cursor: pointer"><i class="fa fa-chevron-left"></i></a>
            </li>
            <li class="page-item" *ngIf="p.activePage < p.lastPage" [class.disabled]="p.activePage >= p.lastPage" (click)="p.setPage(p.activePage + 1)">
                <a class="page-link" style="cursor: pointer"><i class="fa fa-chevron-right"></i></a>
            </li>

            <li class="page-item" *ngIf="p.activePage === p.lastPage" [class.disabled]="p.activePage >= p.lastPage">
                <a class="page-link" style="cursor: pointer"><i class="fa fa-chevron-right"></i></a>
            </li>
        </ul>
        <ul class="pagination float-right mb-0" *ngIf="p.dataLength > minRowsOnPage">
            <li *ngFor="let rows of rowsOnPageSet" [class.active]="p.rowsOnPage===rows" (click)="p.setRowsOnPage(rows)">
                <a style="cursor: pointer">{{rows}}</a>
            </li>
        </ul>
    </mfPaginator>
    `,
})
export class BootstrapPaginator implements OnChanges {

    @Input() rowsOnPageSet = [];
    @Input() mfTable: DataTable;
    @Input() errorPages: number[];

    minRowsOnPage = 0;

    ngOnChanges(changes: any): any {
        if (changes.rowsOnPageSet) {
            this.minRowsOnPage = _.min(this.rowsOnPageSet);
        }
    }

    isPageHaveError(p: Paginator, index: number) {
        const haveError = (this.errorPages && this.errorPages.length > 0) ? this.errorPages.indexOf(index) !== -1 : false;
        return haveError;
    }

}
