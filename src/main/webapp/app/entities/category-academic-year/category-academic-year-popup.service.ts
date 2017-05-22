import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoryAcademicYear } from './category-academic-year.model';
import { CategoryAcademicYearService } from './category-academic-year.service';
@Injectable()
export class CategoryAcademicYearPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private categoryAcademicYearService: CategoryAcademicYearService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.categoryAcademicYearService.find(id).subscribe((categoryAcademicYear) => {
                this.categoryAcademicYearModalRef(component, categoryAcademicYear);
            });
        } else {
            return this.categoryAcademicYearModalRef(component, new CategoryAcademicYear());
        }
    }

    categoryAcademicYearModalRef(component: Component, categoryAcademicYear: CategoryAcademicYear): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.categoryAcademicYear = categoryAcademicYear;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
