import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from '@angular/common';

export class NgbDateFRParserFormatter  extends NgbDateParserFormatter {
	datePipe = new DatePipe('en-US');
	constructor(
		private dateFormatString: string) {
		super();
	}
	format(date: NgbDateStruct): string {
		if (date === null) {
			return '';
		}
		try {
			return this.datePipe.transform(new Date(date.year, date.month - 1, date.day), 'MM/dd/yyyy');
		} catch (e) {
			return '';
		}
	}
	parse(value: string): NgbDateStruct {
		
		let returnVal: NgbDateStruct;
		if (!value) {
			returnVal = null;
		} else {
			try {
				if(!(/\d{1,2}[/]\d{1,2}[/]\d{4}/.test(value)) && !(/\d{1,2}[-]\d{1,2}[-]\d{4}/.test(value))){					
					return  null;
				}else{					
					let dateParts = this.datePipe.transform(value, 'MM-dd-yyyy').split('-');
					returnVal = { year: parseInt(dateParts[2]), month: parseInt(dateParts[0]), day: parseInt(dateParts[1]) };
				}
			} catch (e) {
				returnVal = null;
			}
		}
		return returnVal;
	}
}