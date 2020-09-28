import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectDropDown } from '../SelectDropDown.datatype';

const DROPDOWN_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiSelectTextComponent),
  multi: true
};

@Component({
  selector: 'multi-select-text',
  templateUrl: 'multi-select-text.component.html',
  providers: [DROPDOWN_VALUE_ACCESSOR]
})
export class MultiSelectTextComponent implements ControlValueAccessor {
  
  width: string;
  @Input() label = 'SELECT ONE';
  @Input() itemList: any;
  @Input() errorFields: any[] = [];
  @Input() errorName: string;

  @Input() descKey: string;
  @Input() idKey: string;


  // @ViewChild('mbutton') elementView;

  selectedItemIds: string[] = [];
  selectedList: any[] = [];

  currentSelectedItem: any;

  /**
   * 
   * @param value - Expected empty [] or [] of id's (string)
   */
  writeValue(value: any): void {
    if (value !== undefined && value !== null && value !== '' && this.itemList) {
      this.selectedItemIds = value;
      for (let index = 0; index < this.selectedItemIds.length; ++index) {
        const item = this.getItem(this.selectedItemIds[index]);
        if (item) {
          this.selectedList.push(item);
        }
      }
    }
    this.currentSelectedItem = new SelectDropDown();
    this.currentSelectedItem.description = this.label;
  }

  onModelChange: Function = (_change: any) => { };
  onModelTouched: Function = () => { };

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error("Method not implemented.");
  }

  getItem = (id: string) => {
    if (this.itemList && this.itemList.length >= 1) {
      return this.itemList.find(i => i[this.idKey] === id);
    }
  }

  addItem = (item: any) => {
    const index = this.selectedItemIds.indexOf(item[this.idKey]);
    if (index < 0) {
      this.selectedItemIds.push(item[this.idKey]);
      this.selectedList.push(item);
    } else {
      this.selectedItemIds.splice(index, 1);
      this.selectedList.splice(index, 1);  
    }
    this.onModelChange(this.selectedItemIds);
    this.onModelTouched();
  }

  removeItem = (index) => {
    this.selectedItemIds.splice(index, 1);
    this.selectedList.splice(index, 1);
    this.onModelChange(this.selectedItemIds);
    this.onModelTouched();
  }

  preselectItem(selectedAttributesList: any[], idKey): void {
    selectedAttributesList.forEach(item => {
      this.selectedItemIds.push(item[idKey]);
      this.selectedList.push(item);
    })
    this.onModelChange(this.selectedItemIds);
  }

}
