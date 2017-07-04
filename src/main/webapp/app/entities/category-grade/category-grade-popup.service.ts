import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoryGrade } from './category-grade.model';
import { CategoryGradeService } from './category-grade.service';

@Injectable()
export class CategoryGradePopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private categoryGradeService: CategoryGradeService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.categoryGradeService.find(id).subscribe((categoryGrade) => {
                this.categoryGradeModalRef(component, categoryGrade);
            });
        } else {
            return this.categoryGradeModalRef(component, new CategoryGrade());
        }
    }

    categoryGradeModalRef(component: Component, categoryGrade: CategoryGrade): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.categoryGrade = categoryGrade;
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
