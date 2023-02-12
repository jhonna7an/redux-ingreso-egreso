import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { InresoEgresoService } from '../services/inreso-egreso.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { isLoading, stopLoading } from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: InresoEgresoService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.loadingSubs = this.store.select('ui')
      .subscribe(({ isLoading }) => this.cargando = isLoading)

    this.ingresoForm = this.fb.group({
      description: ['', Validators.required],
      monto: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe()
  }

  save(){
    if (this.ingresoForm.invalid) {
      return;
    }

    this.store.dispatch(isLoading())

    const { description, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(description, monto, this.tipo);
    console.log(ingresoEgreso);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoForm.reset();
        this.store.dispatch(stopLoading())
        Swal.fire('Registro creado', description, 'success')
      })
      .catch(error => {
        this.store.dispatch(stopLoading())
        Swal.fire('Error', error.message, 'error')
      });
  }
}
