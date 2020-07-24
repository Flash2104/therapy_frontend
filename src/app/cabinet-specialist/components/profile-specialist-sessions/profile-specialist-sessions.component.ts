import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpecialistService, AuthService } from 'src/app/common/services';
import { Session } from 'src/app/common/models';
import { PaginationComponent } from 'src/app/layout/pagination/pagination.component';

@Component({
	selector: 'app-profile-specialist-sessions',
	templateUrl: './profile-specialist-sessions.component.html',
	styleUrls: ['./profile-specialist-sessions.component.scss']
})
export class ProfileSpecialistSessionsComponent implements OnInit {

    public sessions: Session[];

    public pageSize = 10;
    public pageNumber = 1;
    public totalPages = 1;

    @ViewChild(PaginationComponent) pagination: PaginationComponent;

    constructor(
        private authService: AuthService,
        private specialistService: SpecialistService,
        private router: Router
    ) {

    }

    private loadSessions(pageNumber: number, pageSize: number) {
        this.specialistService.getSessions({ pageNumber, pageSize })
            .subscribe(sessionsResponse => {
                this.pageSize = sessionsResponse.pageSize;
                this.pageNumber = sessionsResponse.currentPage;
                this.totalPages = sessionsResponse.totalPages;
                this.sessions = sessionsResponse.data;
            });
    }

    ngOnInit(): void {
        this.authService.isLoggedIn
            .subscribe(logged => {
                if (!logged) {
                    this.router.navigate(['/']);

                    return;
                }

                this.loadSessions(1, 10);
            });
    }

    setPageSize(value: number) {
		this.loadSessions(1, Number(value));
	}

	setPageNumber(value: number) {
		window.scroll(0,0);
		this.loadSessions(value, this.pageSize);
    }
}