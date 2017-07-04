import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuestionEssay } from './question-essay.model';
import { QuestionEssayService } from './question-essay.service';

@Injectable()
export class QuestionEssayPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private questionEssayService: QuestionEssayService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.questionEssayService.find(id).subscribe((questionEssay) => {
                this.questionEssayModalRef(component, questionEssay);
            });
        } else {
            return this.questionEssayModalRef(component, new QuestionEssay());
        }
    }

    questionEssayModalRef(component: Component, questionEssay: QuestionEssay): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionEssay = questionEssay;
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
