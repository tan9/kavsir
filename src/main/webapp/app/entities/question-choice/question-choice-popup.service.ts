import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { QuestionChoice } from './question-choice.model';
import { QuestionChoiceService } from './question-choice.service';

@Injectable()
export class QuestionChoicePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private questionChoiceService: QuestionChoiceService

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
                this.questionChoiceService.find(id)
                    .subscribe((questionChoiceResponse: HttpResponse<QuestionChoice>) => {
                        const questionChoice: QuestionChoice = questionChoiceResponse.body;
                        this.ngbModalRef = this.questionChoiceModalRef(component, questionChoice);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.questionChoiceModalRef(component, new QuestionChoice());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    questionChoiceModalRef(component: Component, questionChoice: QuestionChoice): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionChoice = questionChoice;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
