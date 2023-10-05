import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LignesComponent } from './pages/lignes/lignes.component';
import { LigneComponent } from './pages/ligne/ligne.component';
import { DeviceComponent } from './pages/device/device.component';
import { AdddeviceComponent } from './pages/adddevice/adddevice.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PipesModule } from 'w-ng5';
import { DeviceMapsComponent } from './device-maps/device-maps.component';
import { MapsglobalComponent } from './pages/mapsglobal/mapsglobal.component';
import { AddAreaComponent } from './pages/add-area/add-area.component';
import { AddLigneComponent } from './pages/add-ligne/add-ligne.component';
import { EditAreaComponent } from './pages/edit-area/edit-area.component';
import { EditLigneComponent } from './pages/edit-ligne/edit-ligne.component';
import { EditDeviceComponent } from './pages/edit-device/edit-device.component';
import { SearchfilterPipe } from './searchfilter.pipe';
import { LocationComponent } from './pages/location/location.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { TreeviewModule } from 'ngx-treeview';
import { AffectLigneToAreaComponent } from './pages/affect-ligne-to-area/affect-ligne-to-area.component';
import { AffectDeviceToLigneComponent } from './pages/affect-device-to-ligne/affect-device-to-ligne.component';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import {NgbDropdownModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ProgressBarModule} from 'angular-progress-bar';
import { SearchfilterareaPipe } from './searchfilterarea.pipe';
import { SearchfilterlignePipe } from './searchfilterligne.pipe';
import { ProfileDevicesComponent } from './pages/profile-devices/profile-devices.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AssignProfileComponent } from './pages/assign-profile/assign-profile.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {NgxPaginationModule} from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {MatSelectModule} from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ConfirmmailComponent } from './confirmmail/confirmmail.component';
import { DataComponent } from './pages/data/data.component';
import { GaugeChartModule } from 'angular-gauge-chart';
import { ChartsModule } from 'ng2-charts';
import { AddSiteFromExcelFileComponent } from './add-site-from-excel-file/add-site-from-excel-file.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { LicenseComponent } from './pages/license/license.component';
import { ProfileuserComponent } from './profileuser/profileuser.component';
import { DataDeviceComponent } from './pages/data-device/data-device.component';
import { NgYasYearPickerModule } from 'ngy-year-picker';
import { ADDUserComponent } from './pages/adduser/adduser.component';
import { AlertsComponent } from './pages/alerts/alerts.component';
import { FactureComponent } from './pages/facture/facture.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NewpasswordComponent } from './newpassword/newpassword.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    RegisterComponent,
    LignesComponent,
    LigneComponent,
    DeviceComponent,
    AdddeviceComponent,
    DeviceMapsComponent,
    MapsglobalComponent,
    AddAreaComponent,
    AddLigneComponent,
    EditAreaComponent,
    EditLigneComponent,
    EditDeviceComponent,
    SearchfilterPipe,
    LocationComponent,
    InventoryComponent,
    AffectLigneToAreaComponent,
    AffectDeviceToLigneComponent,
    SearchfilterareaPipe,
    SearchfilterlignePipe,
    ProfileDevicesComponent,
    AssignProfileComponent,
    ConfirmmailComponent,
    DataComponent,
    AddSiteFromExcelFileComponent,
    LicenseComponent,
    ProfileuserComponent,
    DataDeviceComponent,
    ADDUserComponent,
    AlertsComponent,
    FactureComponent,
    ForgetPasswordComponent,
    NewpasswordComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true
    }),
    TreeViewModule,
    SidebarModule,
    ProgressBarModule,
    NgxPaginationModule,
    HttpClientModule,
    MatSliderModule,
    MatButtonModule,
    MatTreeModule,
    MatIconModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgMultiSelectDropDownModule.forRoot(),
    AutocompleteLibModule,
    PipesModule,
    NgxPaginationModule,
    TreeviewModule.forRoot(),
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    NgbDropdownModule,
    ColorPickerModule,
    SimpleNotificationsModule.forRoot(),
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}),
    MatSelectModule,
    MatDatepickerModule,
    GaugeChartModule,
    ChartsModule,
    MatProgressSpinnerModule,
    NgYasYearPickerModule,
    TranslateModule.forRoot( {
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    NgbModule,
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
