import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import { UsuariosI } from '../../models/usuarios';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  //Arreglo que contendra todos los usuarios de la bd
  public users:any = [];

  constructor(private usuariosService: UsuariosService,
              private router: Router) { 
    this.users = new Array()
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.usuariosService.getUsers()
                        .subscribe(res=>{
                            this.users = res as UsuariosService[];
                        })
  }//Fin de getUsers

  showUser(_id:string){
    this.router.navigate(['usuarios/'+_id]);
  }//Fin de showUser
}

