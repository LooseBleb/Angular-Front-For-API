import { Component, OnInit } from '@angular/core';
import { Tipo } from 'src/app/models/Tipo';
import { TypesService } from 'src/app/services/types.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategorysService } from 'src/app/services/categorys.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['../list-categorys/list-categorys.component.css'],
})
export class NewCategoryComponent implements OnInit {

  form: any;
  tipos: Tipo[] | undefined;
  erros: string[] = [];

  constructor(private typesService: TypesService, private categoryService: CategorysService, private router: Router, private SnackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.typesService.GetAll().subscribe(result => {
      this.tipos = result;
    })

    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required,Validators.maxLength(50)]),
      icone: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
      typeId: new FormControl(null, [Validators.required]),
    });

  }

  get propriedade() {
    return this.form.controls;
  }

  PostForm(): void {
    const categoria = this.form.value;

    this.categoryService.PostCategory(categoria).subscribe(result => {
      this.router.navigate(['categorys/list']);
      this.SnackBar.open(result.message, null!, {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
    },
      (err) => {
        if (err.status === 400) {
          for (const camp in err.error.errors) {
            if (err.error.errors.hasOwnProperty(camp)) 
            {
              for(var error in err.error.errors[camp]){
                this.SnackBar.open(err.error.errors[camp], null!, {
                  duration: 2000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                })   
              }
            }
          }
        }
      })
  };

  BackList(): void {
    this.router.navigate(['categorys/list'])
  }

}
