import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { DetailModule } from './detail/detail.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login/',
    loadChildren: 'app/login/login.module#LoginModule',
  },
  {
    path: 'home/',
    loadChildren: 'app/home/home.module#HomeModule',
  },
  {
    path: 'detail/',
    loadChildren: 'app/detail/detail.module#DetailModule',
  },
  { path: 'notfound', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'notfound' },
];
 
@NgModule({
  imports: [ 
    // RouterModule.forRoot(routes),
    RouterModule.forRoot(routes, { useHash: true }),
    LoginModule,
    HomeModule,
    DetailModule
  ],
  declarations:[PageNotFoundComponent],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}