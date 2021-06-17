import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import { UsuariosI } from '../../models/usuarios';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

//Importar los validadores personalizados para validar el password
//y confirmar que los password coinciden
import { mustMatch } from '../../helpers/must-match-validator';
import { $ } from 'protractor';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  //Variable para el modal
  closeResult = '';


  //Variable para el formulario
  public registerForm!: FormGroup;
  public submitted = false;

  //Variable que contendra los datos del usuario a eliminar
  public user:any;

  //Arreglo que contendra todos los usuarios de la bd
  public users:any = [];

  constructor(private usuariosService: UsuariosService,
              private router: Router,
              public modal: NgbModal, //Modal para insertar usuario
              public modalDelete: NgbModal, //Modal para eliminar usuario
              private formBuilder: FormBuilder) {
    this.users = new Array()
  }

  ngOnInit(): void {
    //Agregamos al inicializar el componente el validador para el nombre
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [ Validators.required, Validators.email ] ],
      password: ['', [Validators.required, Validators.minLength(6) ] ],
      passwordconfirm: ['', Validators.required ],
      tipo: ['', Validators.required]
    },
    {
      validator: mustMatch('password', 'passwordconfirm')
    }
    );
    this.getUsers();
  }//Fin de ngOnInit

  //metodo getter para un facil acceso a los campos del formulario
  get fields(){
    return this.registerForm?.controls;
  }//Fin de fields

  onSubmit(){
    this.submitted = true;
    //Detener la ejecucion si la forma no es valida
    if(this.registerForm?.invalid){
      return;
    }
    //console.log(this.registerForm.value);
    let usuario = {
      _id:0,
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      tipo: this.registerForm.value.tipo
    }

    this.usuariosService.addUser(usuario)
                        .subscribe(res =>{
                          console.log(res);
                          this.getUsers();//Obtenemos los usuarios
                          this.registerForm.reset(); //Limpiamos el formulario
                          this.modal.dismissAll(); //Cerramos el modal
                        },
                        err => console.log("HTTP Response", err)
                        )
  }//fin de onSubmit

  getUsers(){
    this.usuariosService.getUsers()
                        .subscribe(res=>{
                            this.users = res as UsuariosService[];
                        })
  }//Fin de getUsers

  showUser(_id:string){
    this.router.navigate(['usuarios/'+_id]);
  }//Fin de showUser

  open(content:any) {
    this.registerForm.reset();
    this.modal.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  } //Fin de getDismissReaseon


  //Metodo para abrir el modal para eliminar usuarios
  abrirModalEliminar(id:string, modalName:any){
    this.usuariosService.getUser(id)
                        .subscribe(res=>{
                          this.user = res as UsuariosI;
                        },
                        err =>console.log("Error al obtener el usuario", err)
                        );
    this.modalDelete.open(modalName, {size: 'sm'})
                    .result.then((res)=>{
                      this.closeResult = `Closed with: ${res}`;
                    }, (reason) => {
                      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                    });
  }//Fin de abrirModalEliminar

  //Metodo para eliminar el usuario definitivamente
  deleteUser(id:string){
    //console.log(id);
    this.usuariosService.removeUser(id)
                        .subscribe(res=>{
                          this.getUsers();
                          this.modalDelete.dismissAll();
                        },
                        err =>console.log("Error al eliminar usuario", err)
                        );
  }//Fin de deleteUser
  
}