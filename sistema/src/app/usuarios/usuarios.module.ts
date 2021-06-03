import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { LoginComponent } from './components/login/login.component';
import { UsuariosService } from './services/usuarios.service';


@NgModule({
  declarations: [
    UsuariosComponent,
    LoginComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    UsuariosRoutingModule
  ],
  providers: [
    UsuariosService
  ]
})
export class UsuariosModule { }
