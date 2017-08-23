import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoryAcademicYear } from './category-academic-year.model';
import { CategoryAcademicYearService } from './category-academic-year.service';

@Injectable()
export class CategoryAcademicYearPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private categoryAcademicYearService: CategoryAcademicYearService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.categoryAcademicYearService.find(id).subscribe((categoryAcademicYear) => {
                    this.ngbModalRef = this.categoryAcademicYearModalRef(component, categoryAcademicYear);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.categoryAcademicYearModalRef(component, new CategoryAcademicYear());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    categoryAcademicYearModalRef(component: Component, categoryAcademicYear: CategoryAcademicYear): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.categoryAcademicYear = categoryAcademicYear;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
