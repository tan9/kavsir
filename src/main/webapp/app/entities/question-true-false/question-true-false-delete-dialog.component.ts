import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IQuestionTrueFalse } from 'app/shared/model/question-true-false.model';
import { QuestionTrueFalseService } from './question-true-false.service';

@Component({
  selector: 'jhi-question-true-false-delete-dialog',
  templateUrl: './question-true-false-delete-dialog.component.html'
})
export class QuestionTrueFalseDeleteDialogComponent {
  questionTrueFalse: IQuestionTrueFalse;

  constructor(
    protected questionTrueFalseService: QuestionTrueFalseService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.questionTrueFalseService.delete(id).subscribe(response => {
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
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionTrueFalse }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(QuestionTrueFalseDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.questionTrueFalse = questionTrueFalse;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/question-true-false', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/question-true-false', { outlets: { popup: null } }]);
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
