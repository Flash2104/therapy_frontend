import { Component } from '@angular/core';
import { AuthService, UsersService, SpecialistService } from 'src/app/common/services';
import { User, Specialist } from 'src/app/common/models';
import { StringHelper } from 'src/app/common/helpers';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/common/enums';

@Component({
	selector: 'profile-specialist-header',
	templateUrl: './profile-specialist-header.component.html',
	styleUrls: ['./profile-specialist-header.component.scss']
})
export class ProfileSpecialistHeaderComponent {
	
	public isLoggedIn: boolean;
	public user: User;
	public specialist: Specialist;

	public isMobileNavExpanden = false;
	
    constructor(
		private authService: AuthService,
		private usersService: UsersService,
		private specialistService: SpecialistService,
		private router: Router
	) {
		this.authService.isLoggedIn
			.subscribe(logged => {
				this.isLoggedIn = logged;

				if (logged) {
					this.loadUserInfo();
				}
			});
	}
	
	private loadUserInfo() {
		this.usersService.getUserInfo()
			.subscribe(user => {
				this.user = user;

				if (user.role == UserRole.Specialist) {
					this.loadSpecialist();
				}
			});
	}

	private loadSpecialist() {
		this.specialistService.getSpecialistInfo()
			.subscribe(specialistInfoResponse => {
				this.specialist = specialistInfoResponse.data;
			});
	}

	getAvatar() {
		return StringHelper.getFirstLetter(this.user.lastName);
	}

	getPhone() {
		return StringHelper.formatPhone(this.user.phoneNumber);
	}

	isCabinetRoute() {
		if (this.router.url.includes('profile')) {
			return true;
		}

		return false;
	}

	toggleMobileNav() {
		this.isMobileNavExpanden = !this.isMobileNavExpanden;
	}

	scrollToElement(elementID: string) {
		const element = document.querySelector(elementID);

		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}

		this.toggleMobileNav();
    }
}