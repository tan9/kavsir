import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuestionGroup } from './question-group.model';
import { QuestionGroupService } from './question-group.service';
@Injectable()
export class QuestionGroupPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private questionGroupService: QuestionGroupService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.questionGroupService.find(id).subscribe((questionGroup) => {
                this.questionGroupModalRef(component, questionGroup);
            });
        } else {
            return this.questionGroupModalRef(component, new QuestionGroup());
        }
    }

    questionGroupModalRef(component: Component, questionGroup: QuestionGroup): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionGroup = questionGroup;
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
