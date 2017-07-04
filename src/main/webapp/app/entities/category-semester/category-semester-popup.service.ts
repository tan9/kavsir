import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategorySemester } from './category-semester.model';
import { CategorySemesterService } from './category-semester.service';

@Injectable()
export class CategorySemesterPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private categorySemesterService: CategorySemesterService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.categorySemesterService.find(id).subscribe((categorySemester) => {
                this.categorySemesterModalRef(component, categorySemester);
            });
        } else {
            return this.categorySemesterModalRef(component, new CategorySemester());
        }
    }

    categorySemesterModalRef(component: Component, categorySemester: CategorySemester): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.categorySemester = categorySemester;
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
