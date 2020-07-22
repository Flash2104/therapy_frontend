import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, PatientService } from 'src/app/common/services';
import { Problem } from 'src/app/common/models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'cabinet-create-problem',
	templateUrl: './create-problem.component.html',
	styleUrls: ['./create-problem.component.scss']
})
export class CreateProblemComponent implements OnInit {
    
    public isLoading = false;

    public createProblemForm: FormGroup;

    constructor(
        private authService: AuthService,
        private patientService: PatientService,
        private router: Router,
        private spinner: NgxSpinnerService
    ) {
        
    }

    ngOnInit(): void {
        this.authService.isLoggedIn
            .subscribe(logged => {
                if (!logged) {
                    this.router.navigate(['/sign-in']);

                    return;
                }

                this.initCreateProblemForm();
            });
    }

    private initCreateProblemForm() {
        this.createProblemForm = new FormGroup({
            problemText: new FormControl(null, [Validators.required])
        });
    }

    isFormValid() {
        return this.createProblemForm.valid;
    }

    submit(form: FormGroup) {
        if (form.invalid) {
            alert('error');

            return;
        }

        this.isLoading = true;
        this.spinner.show();

        this.patientService.createProblem(form.value)
            .subscribe(res => {
                if (!res.success) {
                    alert(res.message);
                    
                    this.isLoading = false;
                    this.spinner.hide();

                    return;
                }

                this.router.navigate([`/profile/problems/${res.data.id}/choose-specialist`]);

                this.isLoading = false;
                this.spinner.hide();
            });
    }
}