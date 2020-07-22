import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, PatientService, PaymentsService } from 'src/app/common/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreatePaymentRequest } from 'src/app/common/models/request';
import { PaymentType } from 'src/app/common/enums';

@Component({
	selector: 'cabinet-deposit',
	templateUrl: './deposit.component.html',
	styleUrls: ['./deposit.component.scss']
})
export class CabinetDepositComponent implements OnInit {

    public depositForm: FormGroup;
    
    constructor(
        private authService: AuthService,
        private patientService: PatientService,
        private paymentsService: PaymentsService,
        private router: Router
    ) {
        
    }

    ngOnInit(): void {
        this.authService.isLoggedIn
            .subscribe(logged => {
                if (!logged) {
                    this.router.navigate(['/sign-in']);
                }

                this.initDepositForm();
            });
    }

    private initDepositForm() {
        this.depositForm = new FormGroup({
            amount: new FormControl(null, [Validators.required])
        });
    }

    submit() {
        if (this.depositForm.invalid) {
            alert('form invalid');

            return;
        }

        const request: CreatePaymentRequest = {
            amount: parseInt(this.depositForm.value['amount']),
            type: PaymentType.Deposit
        };

        this.paymentsService.createPayment(request)
            .subscribe(res => {
                if (!res.success) {
                    alert(res.message);

                    return;
                }

                window.location.href = res.redirectUrl;
            });
    }
}