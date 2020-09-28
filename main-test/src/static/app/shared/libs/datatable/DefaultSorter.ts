import {Component, Input, OnInit} from '@angular/core';
import {DataTable, SortEvent} from './DataTable';

@Component({
    selector: "mfDefaultSorter",
    template: `
        <a style="cursor: pointer" (click)="sort()" class="text-nowrap">
            <ng-content></ng-content>
            <i *ngIf="isSortedByMeAsc" [ngClass]="{'text-primary':isSortedByMeAsc}" class="sort fa fa-fw fa-caret-up" aria-hidden="true"></i>
            <i *ngIf="!isSortedByMeAsc" class="sort fa fa-fw fa-caret-down" [ngClass]="{'mydeq-teal':isSortedByMeDesc}" aria-hidden="true"></i>
        </a>`
})
export class DefaultSorter implements OnInit {

    @Input('by') private sortBy: string;
    @Input('initial') private initial: string;

    isSortedByMeAsc = false;
    isSortedByMeDesc = false;

    public constructor(private mfTable: DataTable) {
        mfTable.onSortChange.subscribe((event: SortEvent) => {
            this.isSortedByMeAsc = (event.sortBy === this.sortBy && event.sortOrder === 'asc');
            this.isSortedByMeDesc = (event.sortBy === this.sortBy && event.sortOrder === 'desc');
        })
    }

    ngOnInit() {
        if (this.initial) {
            if (this.initial === 'asc') {
                this.mfTable.setSort(this.sortBy, 'asc');
            } else {
                this.mfTable.setSort(this.sortBy, 'desc');
            }
        }
    }

    sort() {
        if (this.isSortedByMeAsc) {
            this.mfTable.setSort(this.sortBy, 'desc');
        } else {
            this.mfTable.setSort(this.sortBy, 'asc');
        }
    }
}
