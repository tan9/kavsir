import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { QuestionTrueFalse } from './question-true-false.model';
import { QuestionTrueFalsePopupService } from './question-true-false-popup.service';
import { QuestionTrueFalseService } from './question-true-false.service';

@Component({
    selector: 'jhi-question-true-false-delete-dialog',
    templateUrl: './question-true-false-delete-dialog.component.html'
})
export class QuestionTrueFalseDeleteDialogComponent {

    questionTrueFalse: QuestionTrueFalse;

    constructor(
        private questionTrueFalseService: QuestionTrueFalseService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.questionTrueFalseService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'questionTrueFalseListModification',
                content: 'Deleted an questionTrueFalse'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-question-true-false-delete-popup',
    template: ''
})
export class QuestionTrueFalseDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionTrueFalsePopupService: QuestionTrueFalsePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.questionTrueFalsePopupService
                .open(QuestionTrueFalseDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
