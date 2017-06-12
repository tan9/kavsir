import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuestionChoiceOption } from './question-choice-option.model';
import { QuestionChoiceOptionService } from './question-choice-option.service';

@Injectable()
export class QuestionChoiceOptionPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private questionChoiceOptionService: QuestionChoiceOptionService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.questionChoiceOptionService.find(id).subscribe((questionChoiceOption) => {
                this.questionChoiceOptionModalRef(component, questionChoiceOption);
            });
        } else {
            return this.questionChoiceOptionModalRef(component, new QuestionChoiceOption());
        }
    }

    questionChoiceOptionModalRef(component: Component, questionChoiceOption: QuestionChoiceOption): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionChoiceOption = questionChoiceOption;
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
