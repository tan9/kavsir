import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuestionTrueFalse } from './question-true-false.model';
import { QuestionTrueFalseService } from './question-true-false.service';

@Injectable()
export class QuestionTrueFalsePopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private questionTrueFalseService: QuestionTrueFalseService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.questionTrueFalseService.find(id).subscribe((questionTrueFalse) => {
                this.questionTrueFalseModalRef(component, questionTrueFalse);
            });
        } else {
            return this.questionTrueFalseModalRef(component, new QuestionTrueFalse());
        }
    }

    questionTrueFalseModalRef(component: Component, questionTrueFalse: QuestionTrueFalse): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionTrueFalse = questionTrueFalse;
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
