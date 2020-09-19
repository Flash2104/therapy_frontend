import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, SpecialistsService, StorageService } from 'src/app/common/services';
import { Specialist } from 'src/app/common/models';
import { SpecialistsSorter } from './specialists-sorter.enum';
import { SortBy } from 'src/app/common/enums';
import { PaginationComponent } from 'src/app/layout/pagination/pagination.component';
import { LocalStorageHelper } from 'src/app/common/helpers';
import { Router } from '@angular/router';

@Component({
	selector: 'app-specialists',
	templateUrl: './specialists.component.html',
	styleUrls: ['./specialists.component.scss']
})
export class SpecialistsComponent implements OnInit {

	public isLoggedIn = false;
	public specialists: Specialist[];

	public pageSize = 8;
	public pageNumber = 1;
	public totalPages = 1;

	public sorter: SpecialistsSorter;
	public sortBy: SortBy;

	@ViewChild(PaginationComponent) pagination: PaginationComponent;

	constructor(
		private authService: AuthService,
		private storageService: StorageService,
		private specialistsService: SpecialistsService,
		private router: Router
	) {
		
	}

	ngOnInit(): void {
		this.loadSpecialists(1, 8);

		this.authService.isLoggedIn
			.subscribe(logged => {
				this.isLoggedIn = logged;
			});
	}

	private loadSpecialists(pageNumber: number, pageSize: number) {
		this.specialistsService.getSpecialists({ pageNumber, pageSize })
			.subscribe(res => {
				if (!res.success) {
					return;
				}

				this.pageNumber = res.currentPage;
				this.pageSize = res.pageSize;
				this.totalPages = res.totalPages;

				if (!this.sorter) {
					this.sorter = SpecialistsSorter.Price;
					this.sortBy = SortBy.ASC;

					this.specialists = res.data.sort((a, b) => {
						return a.price - b.price;
					});

					//window.scroll(0,0);

					return;
				}

				this.sortSpecialists(res.data);
			})
	}

	private sortSpecialists(specialists: Specialist[]) {
		if (this.sorter == SpecialistsSorter.Price) {
			if (this.sortBy == SortBy.ASC) {
				this.specialists = specialists.sort((a, b) => {
					return a.price - b.price;
				});

				//window.scroll(0,0);

				return;
			}
			
			if (this.sortBy == SortBy.DESC) {
				this.specialists = specialists.sort((a, b) => {
					return b.price - a.price;
				});

				//window.scroll(0,0);

				return;
			}

			return;
		}

		if (this.sorter == SpecialistsSorter.Rating) {
			if (this.sortBy == SortBy.ASC) {
				this.specialists = specialists.sort((a, b) => {
					return a.rating - b.rating;
				});

				//window.scroll(0,0);

				return;
			}
			
			if (this.sortBy == SortBy.DESC) {
				this.specialists = specialists.sort((a, b) => {
					return b.rating - a.rating;
				});

				//window.scroll(0,0);

				return;
			}

			return;
		}

		if (this.sorter == SpecialistsSorter.Reviews) {
			if (this.sortBy == SortBy.ASC) {
				this.specialists = specialists.sort((a, b) => {
					return a.reviews.length - b.reviews.length;
				});

				//window.scroll(0,0);

				return;
			}
			
			if (this.sortBy == SortBy.DESC) {
				this.specialists = specialists.sort((a, b) => {
					return b.reviews.length - a.reviews.length;
				});

				//window.scroll(0,0);

				return;
			}

			return;
		}

		return;
	}

	setPageSize(value: number) {
		this.loadSpecialists(1, Number(value));
	}

	setPageNumber(value: number) {
		window.scroll(0,0);
		this.loadSpecialists(value, this.pageSize);
	}

	setSorter(sorter: SpecialistsSorter) {
		if (sorter == this.sorter) {
			this.toggleSortDirection();

			return;
		}

		this.sorter = sorter;
		this.sortBy = SortBy.ASC;

		this.sortSpecialists(this.specialists);
	}

	toggleSortDirection() {
		if (this.sortBy == SortBy.ASC) {
			this.sortBy = SortBy.DESC;

			this.sortSpecialists(this.specialists);

			return;
		}

		if (this.sortBy == SortBy.DESC) {
			this.sortBy = SortBy.ASC;

			this.sortSpecialists(this.specialists);

			return;
		}

		return;
	}

	showSpecialistDialog(specialist: Specialist) {
        if (!this.isLoggedIn) {
            LocalStorageHelper.saveSpecialist(specialist);

            this.router.navigate(['/sign-up']);

            return;
        }

        let dialog = document.querySelector('.choose-specialist-dialog');

        dialog.classList.remove('hidden');
        dialog.classList.add('show');
        
        this.storageService.setSpecialist(specialist);
    }
}