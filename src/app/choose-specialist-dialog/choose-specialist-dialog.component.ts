import { Component, OnInit } from '@angular/core';
import { PatientService, StorageService, UsersWalletsService } from 'src/app/common/services';
import { Problem, Specialist, UserWallet } from '../common/models';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'choose-specialist-dialog',
    templateUrl: './choose-specialist-dialog.component.html',
    styleUrls: ['./choose-specialist-dialog.component.scss']
})
export class ChooseSpecialistDialogComponent implements OnInit {

    public specialist: Specialist;
    public problems: Problem[];
    public wallet: UserWallet;

    public selectedProblem: Problem;
    public isNewProblem = false;
    public newProblemText: string;

    constructor(
        private patientService: PatientService,
        private storageService: StorageService,
        private walletsService: UsersWalletsService,
        private router: Router
    ) { }

    ngOnInit(): void {
        document.body.onclick = (event: any) => {
            if (!event.target.classList.contains('modal-button')) {
                if (event.target.parentNode.classList.contains('show')) {
                    this.close();
                }
            }
        }

        this.loadSpecialist();
        this.loadProblems();
        this.loadWallet();
    }

    public selectProblem(problem?: Problem) {
        if (problem) {
            this.isNewProblem = false;
            this.selectedProblem = problem;

            return;
        }

        this.selectedProblem = null;
        this.isNewProblem = true;
    }

    private loadSpecialist() {
        this.storageService.getSpecialist()
            .subscribe(specialist => {
                this.specialist = specialist;
                console.log(this.specialist);
                console.log(this.problems);
            });
    }

    private loadProblems() {
        this.patientService.getProblems()
            .subscribe(res => {
                this.problems = res.data;
                this.selectProblem(this.problems[0]);
            });
    }

    private loadWallet() {
        this.walletsService.getMyWallet()
            .subscribe(res => {
                this.wallet = res.data;
            });
    }

    close() {
        let dialog = document.querySelector('.choose-specialist-dialog');
        dialog.classList.remove('show')
        dialog.classList.add('hidden');
        this.storageService.resetSpecialist();
    }
    
    labelClick(inputName: string) {
        this[inputName].nativeElement.focus();
    }
    
    createProblem() {
        if (!this.newProblemText || this.newProblemText == '') {
            return;
        }

        this.patientService.createProblem({
            problemText: this.newProblemText
        })
        .subscribe(problemResponse => {
            this.patientService.createProblemSession({
                specialistID: this.specialist.id
            }, problemResponse.data.id)
            .subscribe(sessionResponse => {

                if ((this.wallet.balance - this.wallet.lockedBalance) < this.specialist.price) {
                    this.router.navigate([`/profile/problems/${problemResponse.data.id}/choose-specialist/${this.specialist.id}/pay`]);
        
                    return;
                }

                this.patientService.startSession(problemResponse.data.id, sessionResponse.sessionID)
                    .subscribe(res => {
                        if (!res.success) {
                            alert(res.message);

                            return;
                        }

                        this.router.navigate(['/profile']);
                    });
            });
        });
    }
    
    startSession() {
        if (!this.selectedProblem) {
            return;
        }

        this.patientService.createProblemSession({
            specialistID: this.specialist.id
        }, this.selectedProblem.id)
        .subscribe(sessionResponse => {
            if (sessionResponse.success) {
                if ((this.wallet.balance - this.wallet.lockedBalance) < this.specialist.price) {
                    this.router.navigate([`/profile/problems/${this.selectedProblem.id}/choose-specialist/${this.specialist.id}/pay`]);
        
                    return;
                }

                this.patientService.startSession(this.selectedProblem.id, sessionResponse.sessionID)
                    .subscribe(res => {
                        if (!res.success) {
                            alert(res.message);

                            return;
                        }

                        this.router.navigate(['/profile']);
                    });
            }
        });
    }

    submit() {
        if (this.isNewProblem) {
            this.createProblem();

            return;
        }

        this.startSession();
    }
}