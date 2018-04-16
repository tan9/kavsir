import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { QuestionTrueFalse } from './question-true-false.model';
import { QuestionTrueFalseService } from './question-true-false.service';

@Injectable()
export class QuestionTrueFalsePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private questionTrueFalseService: QuestionTrueFalseService

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
                this.questionTrueFalseService.find(id)
                    .subscribe((questionTrueFalseResponse: HttpResponse<QuestionTrueFalse>) => {
                        const questionTrueFalse: QuestionTrueFalse = questionTrueFalseResponse.body;
                        this.ngbModalRef = this.questionTrueFalseModalRef(component, questionTrueFalse);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.questionTrueFalseModalRef(component, new QuestionTrueFalse());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    questionTrueFalseModalRef(component: Component, questionTrueFalse: QuestionTrueFalse): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.questionTrueFalse = questionTrueFalse;
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
