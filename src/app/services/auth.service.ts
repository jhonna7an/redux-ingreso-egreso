import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { setUser, unSetUser } from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription = new Subscription();

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) { }

  initAuthListener() {
    this.auth.authState.subscribe((user: any) => {

      if (user) {
        this.userSubscription = this.firestore.doc(`${user.uid}/usuario`)
        .valueChanges()
        .subscribe((firestore_user: any) => {
          console.log(firestore_user);
          const user = Usuario.fromFirebase(firestore_user)
          this.store.dispatch(setUser({ user }))
        });

      } else{
        this.userSubscription.unsubscribe();
        this.store.dispatch(unSetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email);
        return this.firestore.doc(`${user.uid}/usuario`)
          .set({ ...newUser });
      })
  }

  login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState
      .pipe(map(user => user != null));
  }
}
