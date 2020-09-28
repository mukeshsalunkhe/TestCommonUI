import { Component, Output, EventEmitter, forwardRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbDropdownConfig, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectDropDown } from './SelectDropDown.datatype';

import * as _ from 'lodash';

const DROPDOWN_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownComponent),
    multi: true
};

@Component({
    selector: 'custom-dropdown',
    templateUrl: './dropdown.component.html',
    providers: [DROPDOWN_VALUE_ACCESSOR],
})
export class DropdownComponent implements ControlValueAccessor {

    @Input() multiSelect = false;
    @Input() readonly = false;
    @Input() showAlert: boolean | undefined;
    @Input() itemList: any[] = [];
    @Input() code: string;
    @Input() description: string;
    @Input() isSearchable = true;
    @Input() defaultText = 'Select One';

    @Output() itemSelected = new EventEmitter();

    isVisible = false;
    title = '';
    selectedItemIds: string[] = [];
    currentSelectedItem: any;
    selectedItems: any[] = [];
    displayList: any[] = [];
    isDisabled = false;
    errorsList: any[];
    searchFilterText = '';

    constructor(config: NgbDropdownConfig) {
        // config.autoClose = true;
    }

    writeValue(value: any): void {
        if (value !== undefined && value !== null && value !== '-1') {
            const d = this.getItem(value);
            this.currentSelectedItem = new SelectDropDown();
            this.currentSelectedItem.description = d[this.description];
        } else {
            this.currentSelectedItem = new SelectDropDown();
            this.currentSelectedItem.description = this.defaultText;
        }
    }
    registerOnChange(fn: any): void {
        this.onModelChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onModelTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }


    onModelChange: Function = (_change: any) => { };
    onModelTouched: Function = () => { };

    getItem = (typeCode: string) => {
        return _.find(this.itemList, [this.code, typeCode]);
    }

    optionSeleted(dropDown: NgbDropdown, item: any) {
        this.itemSelected.emit(item);
        this.onModelChange(item[this.code]);
        this.onModelTouched();
        this.currentSelectedItem.description = item[this.description];
        dropDown.close();
    }

    clearSearch(event: Event) {
        event.stopPropagation();
        this.searchFilterText = '';
        this.displayList = this.itemList;
    }

    searchFilter(event: Event) {
        if (!this.searchFilterText || this.searchFilterText === '') {
            this.displayList = this.itemList;
            return;
        }
        const regularExp = new RegExp('(' + this.searchFilterText + ')', 'i');
        const desc = this.description;
        this.displayList = _.filter(this.itemList, function (vs) {
            return (
                vs[desc] && vs[desc].match(regularExp)
            );
        });
    }

    dropDownChange(event) {
        if (event) {
            this.displayList = this.itemList;
        }
    }

    trackById(index, item) {
        return item[this.code];
    }

}
