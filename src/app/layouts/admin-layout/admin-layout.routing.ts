import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { LoginComponent } from 'app/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { LignesComponent } from 'app/pages/lignes/lignes.component';
import {LigneComponent} from '../../pages/ligne/ligne.component';
import {DeviceComponent} from '../../pages/device/device.component';
import {MapsglobalComponent} from '../../pages/mapsglobal/mapsglobal.component';
import {InventoryComponent} from '../../pages/inventory/inventory.component';
import {MyguadGuard} from '../../myguad.guard';
import {LicenseComponent} from '../../pages/license/license.component';
import {AlertsComponent} from '../../pages/alerts/alerts.component';
import {FactureComponent} from '../../pages/facture/facture.component';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  role: any;
}
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent , canActivate: [MyguadGuard]},
    { path: 'Area',        component: LignesComponent , canActivate: [MyguadGuard]},
    { path: 'Ligne',        component: LigneComponent , canActivate: [MyguadGuard]},
    { path: 'device',        component: DeviceComponent , canActivate: [MyguadGuard]},
    { path: 'StreetLightMaps',        component: MapsglobalComponent , canActivate: [MyguadGuard]},
    { path: 'Inventory',        component: InventoryComponent , canActivate: [MyguadGuard]},
  { path: 'User',        component: UserComponent , canActivate: [MyguadGuard]},
  { path: 'License',        component: LicenseComponent },
  { path: 'facture',        component: FactureComponent , canActivate: [MyguadGuard]},
];
