import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IQuestionChoice } from 'app/shared/model/question-choice.model';
import { QuestionChoiceService } from './question-choice.service';

@Component({
  selector: 'jhi-question-choice-delete-dialog',
  templateUrl: './question-choice-delete-dialog.component.html'
})
export class QuestionChoiceDeleteDialogComponent {
  questionChoice: IQuestionChoice;

  constructor(
    protected questionChoiceService: QuestionChoiceService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.questionChoiceService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'questionChoiceListModification',
        content: 'Deleted an questionChoice'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-question-choice-delete-popup',
  template: ''
})
export class QuestionChoiceDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionChoice }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(QuestionChoiceDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.questionChoice = questionChoice;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/question-choice', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/question-choice', { outlets: { popup: null } }]);
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
