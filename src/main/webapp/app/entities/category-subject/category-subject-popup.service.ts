import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategorySubject } from './category-subject.model';
import { CategorySubjectService } from './category-subject.service';
@Injectable()
export class CategorySubjectPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private categorySubjectService: CategorySubjectService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.categorySubjectService.find(id).subscribe(categorySubject => {
                this.categorySubjectModalRef(component, categorySubject);
            });
        } else {
            return this.categorySubjectModalRef(component, new CategorySubject());
        }
    }

    categorySubjectModalRef(component: Component, categorySubject: CategorySubject): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.categorySubject = categorySubject;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
