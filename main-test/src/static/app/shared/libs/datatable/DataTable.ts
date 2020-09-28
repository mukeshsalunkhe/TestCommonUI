import { Directive, Input, Output, EventEmitter, SimpleChange, OnChanges, DoCheck, IterableDiffer, IterableDiffers } from '@angular/core';
import * as _ from 'lodash';

export interface SortEvent {
    sortBy: string;
    sortOrder: string
}

export interface PageEvent {
    activePage: number;
    rowsOnPage: number;
    dataLength: number;
    idDynamicTable: boolean;
}

export interface DataEvent {
    length: number;
}

@Directive({
    selector: 'table[mfData]',
    exportAs: 'mfDataTable'
})
export class DataTable implements OnChanges, DoCheck {

    private diff: IterableDiffer<any[]>;
    @Input('mfData') public inputData: any[] = [];

    private sortBy = '';
    private sortOrder = 'asc';

    @Input('mfRowsOnPage') public rowsOnPage = 1000;
    @Input('mfActivePage') public activePage = 1;
    @Input('isDynamicTable') public idDynamicTable = false;
    @Output() pagenumber = new EventEmitter();
    @Output() startSliceIndex = new EventEmitter();

    private mustRecalculateData = false;

    public data: any[];

    public onDataChange = new EventEmitter<DataEvent>();
    public onSortChange = new EventEmitter<SortEvent>();
    public onPageChange = new EventEmitter<PageEvent>();


    constructor(private differs: IterableDiffers) {
        this.diff = differs.find([]).create(null);
    }

    public getSort(): SortEvent {
        return { sortBy: this.sortBy, sortOrder: this.sortOrder };
    }

    public setSort(sortBy: string, sortOrder: string): void {
        if (this.sortBy !== sortBy || this.sortOrder !== sortOrder) {
            this.sortBy = sortBy;
            this.sortOrder = sortOrder;
            this.mustRecalculateData = true;
            this.onSortChange.emit({ sortBy: sortBy, sortOrder: sortOrder });
        }
    }

    public getPage(): PageEvent {
        return { activePage: this.activePage, rowsOnPage: this.rowsOnPage, dataLength: this.inputData.length, idDynamicTable: this.idDynamicTable };
    }

    public setPage(activePage: number, rowsOnPage: number): void {
        if (this.rowsOnPage !== rowsOnPage || this.activePage !== activePage) {
            this.activePage = this.activePage !== activePage ? activePage : this.calculateNewActivePage(this.rowsOnPage, rowsOnPage);
            this.pagenumber.emit(this.activePage);
            this.rowsOnPage = rowsOnPage;
            this.mustRecalculateData = true;
            this.onPageChange.emit({ activePage: this.activePage, rowsOnPage: this.rowsOnPage, dataLength: this.inputData.length, idDynamicTable: this.idDynamicTable });
        }
    }

    private calculateNewActivePage(previousRowsOnPage: number, currentRowsOnPage: number): number {
        const firstRowOnPage = (this.activePage - 1) * previousRowsOnPage + 1;
        const newActivePage = Math.ceil(firstRowOnPage / currentRowsOnPage);
        return newActivePage;
    }

    private recalculatePage() {
        const lastPage = Math.ceil(this.inputData.length / this.rowsOnPage);
        this.activePage = lastPage < this.activePage ? lastPage : this.activePage;
        this.activePage = this.activePage || 1;

        this.onPageChange.emit({
            activePage: this.activePage,
            rowsOnPage: this.rowsOnPage,
            dataLength: this.inputData.length,
            idDynamicTable: this.idDynamicTable
        });
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        if (changes['rowsOnPage']) {
            this.rowsOnPage = changes['rowsOnPage'].previousValue;
            this.setPage(this.activePage, changes['rowsOnPage'].currentValue);
            this.mustRecalculateData = true;
        }
        if (changes['sortBy'] || changes['sortOrder']) {
            if (!_.includes(['asc', 'desc'], this.sortOrder)) {
                this.sortOrder = 'asc';
            }
            if (this.sortBy) {
                this.onSortChange.next({ sortBy: this.sortBy, sortOrder: this.sortOrder });
            }
            this.mustRecalculateData = true;
        }
        if (changes['inputData']) {
            this.inputData = changes['inputData'].currentValue || [];
            this.recalculatePage();
            this.mustRecalculateData = true;
        }
    }

    ngDoCheck() {

        const changes = this.diff.diff(this.inputData);
        if (changes) {
            this.recalculatePage();
            this.mustRecalculateData = true;
        }
        if (this.mustRecalculateData) {
            this.fillData();
            this.mustRecalculateData = false;
        }
    }

    private fillData(): void {
        this.activePage = this.activePage;
        this.rowsOnPage = this.rowsOnPage;

        const offset = (this.activePage - 1) * this.rowsOnPage;
        let data = this.inputData;
        data = _.orderBy(data, [this.sortBy], [this.sortOrder]);
        if (offset >= this.inputData.length) {
            data = _.slice(data, 0, this.inputData.length);
            this.startSliceIndex.emit(0);
        } else {
            data = _.slice(data, offset, offset + this.rowsOnPage);
            this.startSliceIndex.emit(offset);
        }

        this.data = data;
    }
}