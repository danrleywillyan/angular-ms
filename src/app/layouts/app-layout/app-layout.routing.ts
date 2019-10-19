import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/budget/dashboard/dashboard.component';
import { PloaComponent } from '../../pages/budget/ploa/ploa.component';

import { AnalyticPage } from '../../pages/analytic/analytic-page.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { OneTableComponent } from '../../pages/oneTable/oneTable.component';
import { MedicineDetailsComponent } from '../../pages/medicine-details/medicineDetails.component';

import { NotificationComponent } from '../../pages/popular-pharmacy/notification/notification/notification.component';
import { RemedyLifecycleComponent } from '../../pages/budget/remedy-lifecycle/remedy-lifecycle.component';
import { ElucidationComponent } from '../../pages/popular-pharmacy/notification/elucidation/elucidation.component';
import { FormElucidationComponent } from '../../pages/popular-pharmacy/notification/form-elucidation/form-elucidation.component';
import { OccurrenceTypesComponent } from '../../pages/popular-pharmacy/notification/occurrence-types/occurrence-types.component';
import { MulctComponent } from '../../pages/popular-pharmacy/mulct/mulct.component';
import { MedicationComponent } from 'src/app/pages/analytic/medication/medication.component';


import { from } from 'rxjs';

export const AppLayoutRoutes: Routes = [
  // Overview paths
  { path: '', component: RemedyLifecycleComponent },
  { path: 'caf', component: RemedyLifecycleComponent },
  { path: 'leafs/leaf1', component: TablesComponent },
  { path: 'leafs/leaf2', component: OneTableComponent },
  { path: 'leafs/leaf3', component: MedicineDetailsComponent },

  // Budget paths (Orçamento)
  { path: 'budget/dashboard', component: DashboardComponent },
  { path: 'budget/ploa', component: PloaComponent },


  //Analytic paths (Visão Analítica)
  { path: 'analytic/medication/:coord', component: MedicationComponent},
  { path: 'analytic/:coord', component: AnalyticPage },
  { path: 'analytic/:coord/:location', component: AnalyticPage },


  // Predictive paths


  // Popular Pharmacy
  { path: 'popular-pharmacy/notification', component: ElucidationComponent },
  { path: 'popular-pharmacy/notification/form', component: FormElucidationComponent },
  { path: 'popular-pharmacy/notification/occurrences-types', component: OccurrenceTypesComponent },
  { path: 'popular-pharmacy/mulct', component: MulctComponent },
];
