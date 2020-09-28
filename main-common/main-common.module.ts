import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { NeedHelpComponent } from './components/need-help/need-help.component';

@NgModule({

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DataTableModule,
  ],

  declarations: [
   
    NeedHelpComponent
   
  ],

  exports: [
   
    NeedHelpComponent,
    
  ],
  entryComponents: [
    NgbdModalContent
  ],
  providers: [ useFactory: () => new NgbDateFRParserFormatter() }
  ]
})

export class MainCommonModule { }
