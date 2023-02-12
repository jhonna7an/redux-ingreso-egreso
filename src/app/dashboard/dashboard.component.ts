import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { InresoEgresoService } from '../services/inreso-egreso.service';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresoEgresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: InresoEgresoService
  ) { }

  ngOnInit() {

    this.userSubs = this.store.select('user')
      .pipe(filter(auth => auth.user !== null))
      .subscribe( ({ user }) => {
        this.ingresoEgresosSubs = this.ingresoEgresoService.initIngresosEgresos(user.uid)
          .subscribe(ingresosEgresosFirebase => {
            this.store.dispatch(setItems({items: ingresosEgresosFirebase}))
          })
      });
  }

  ngOnDestroy(): void {
    this,this.ingresoEgresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }
}
