import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';

import { HomeComponent }    from './home.component';

const homeroutes = [
  { path: 'home', component: HomeComponent},
];

@NgModule({
  imports: [ RouterModule.forChild(homeroutes) ],
  exports: [ RouterModule ],
  declarations:[HomeComponent]
})
export class HomeRouting {}