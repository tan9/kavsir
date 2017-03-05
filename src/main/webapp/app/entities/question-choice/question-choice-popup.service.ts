import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuestionChoice } from './question-choice.model';
import { QuestionChoiceService } from './question-choice.service';
@Injectable()
export class QuestionChoicePopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private questionChoiceService: QuestionChoiceService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.questionChoiceService.find(id).subscribe(questionChoice => {
                this.questionChoiceModalRef(component, questionChoice);
            });
        } else {
            return this.questionChoiceModalRef(component, new QuestionChoice());
        }
    }

    questionChoiceModalRef(component: Component, questionChoice: QuestionChoice): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionChoice = questionChoice;
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
