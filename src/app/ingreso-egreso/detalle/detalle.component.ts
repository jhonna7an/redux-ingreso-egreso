import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, on } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { InresoEgresoService } from 'src/app/services/inreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[];
  ingresosEgresosSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: InresoEgresoService
  ) { }

  ngOnInit() {
    this.ingresosEgresosSub = this.store.select('ingresosEgresos')
      .subscribe(({ items }) => this.ingresosEgresos = items);
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSub.unsubscribe();
  }

  borrar(uid: string){
    this.ingresoEgresoService.borrar(uid)
      .then(() => Swal.fire('Borrado', 'Se eliminó correctamente', 'success'))
      .catch(error => Swal.fire('Borrado', error.message, 'success'))    
  }
}
