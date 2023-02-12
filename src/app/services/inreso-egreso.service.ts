import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InresoEgresoService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    console.log(ingresoEgreso);
    
    return this.firestore.doc(`${this.authService.user.uid}/ingresos-egresos`)
    .collection('items')
    .add({ ...ingresoEgreso});
  }

  initIngresosEgresos(uid: string){
    return this.firestore.collection(`${ uid }/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map(snapshot => snapshot.map(doc => ({
              ...doc.payload.doc.data() as any,
              uid: doc.payload.doc.id
            })
          )
        )
      );
  }

  borrar(uidItem: string){
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${ uid }/ingresos-egresos/items/${uidItem}`)
      .delete();
  }
}
