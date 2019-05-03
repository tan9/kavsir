import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IQuestionChoiceOption } from 'app/shared/model/question-choice-option.model';
import { QuestionChoiceOptionService } from './question-choice-option.service';

@Component({
  selector: 'jhi-question-choice-option-delete-dialog',
  templateUrl: './question-choice-option-delete-dialog.component.html'
})
export class QuestionChoiceOptionDeleteDialogComponent {
  questionChoiceOption: IQuestionChoiceOption;

  constructor(
    protected questionChoiceOptionService: QuestionChoiceOptionService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.questionChoiceOptionService.delete(id).subscribe(response => {
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
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionChoiceOption }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(QuestionChoiceOptionDeleteDialogComponent as Component, {
          size: 'lg',
          backdrop: 'static'
        });
        this.ngbModalRef.componentInstance.questionChoiceOption = questionChoiceOption;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/question-choice-option', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/question-choice-option', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
