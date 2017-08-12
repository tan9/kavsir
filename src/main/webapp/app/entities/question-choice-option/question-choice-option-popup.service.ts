import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuestionChoiceOption } from './question-choice-option.model';
import { QuestionChoiceOptionService } from './question-choice-option.service';

@Injectable()
export class QuestionChoiceOptionPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private questionChoiceOptionService: QuestionChoiceOptionService

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
                this.questionChoiceOptionService.find(id).subscribe((questionChoiceOption) => {
                    this.ngbModalRef = this.questionChoiceOptionModalRef(component, questionChoiceOption);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.questionChoiceOptionModalRef(component, new QuestionChoiceOption());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    questionChoiceOptionModalRef(component: Component, questionChoiceOption: QuestionChoiceOption): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionChoiceOption = questionChoiceOption;
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
