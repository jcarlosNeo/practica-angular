import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  isEditing = false;
  userId: number | null = null;
  fechaAlta = new Date().toISOString().split('T')[0];
  profileImage: string | ArrayBuffer | null = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      fechaAlta: [{ value: this.fechaAlta, disabled: true }, Validators.required],
      profileImage: ['']
    }, { validators: this.checkPasswords });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        const user = this.userService.getUserById(this.userId);
        if (user) {
          this.isEditing = true;
          this.userForm.patchValue(user);
          this.profileImage = user.profileImage;
          this.fechaAlta = user.fechaAlta;
        }
      }
    });
  }

  // Validador personalizado para comprobar que las contraseñas coinciden
  checkPasswords(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  get f() { return this.userForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const user = {
      ...this.userForm.getRawValue(),
      profileImage: this.profileImage
    };

    if (this.isEditing && this.userId !== null) {
      this.userService.updateUser(this.userId, user);
      this.notificationService.showMessage('Usuario actualizado correctamente');
    } else {
      this.userService.createUser(user);
      this.notificationService.showMessage('Usuario creado correctamente');
    }

    // Redirigir a la lista de usuarios después de guardar
    this.router.navigate(['/users']);
  }

  onFileChange(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profileImage = reader.result as string;
        this.userForm.patchValue({ profileImage: this.profileImage });
      };
    }
  }
}