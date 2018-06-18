import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { QuestionChoiceOption } from './question-choice-option.model';
import { QuestionChoiceOptionPopupService } from './question-choice-option-popup.service';
import { QuestionChoiceOptionService } from './question-choice-option.service';

@Component({
    selector: 'jhi-question-choice-option-delete-dialog',
    templateUrl: './question-choice-option-delete-dialog.component.html'
})
export class QuestionChoiceOptionDeleteDialogComponent {

    questionChoiceOption: QuestionChoiceOption;

    constructor(
        private questionChoiceOptionService: QuestionChoiceOptionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.questionChoiceOptionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'questionChoiceOptionListModification',
                content: 'Deleted an questionChoiceOption'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-question-choice-option-delete-popup',
    template: ''
})
export class QuestionChoiceOptionDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionChoiceOptionPopupService: QuestionChoiceOptionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.questionChoiceOptionPopupService
                .open(QuestionChoiceOptionDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
