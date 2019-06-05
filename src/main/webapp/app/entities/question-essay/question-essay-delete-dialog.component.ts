import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IQuestionEssay } from 'app/shared/model/question-essay.model';
import { QuestionEssayService } from './question-essay.service';

@Component({
  selector: 'jhi-question-essay-delete-dialog',
  templateUrl: './question-essay-delete-dialog.component.html'
})
export class QuestionEssayDeleteDialogComponent {
  questionEssay: IQuestionEssay;

  constructor(
    protected questionEssayService: QuestionEssayService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.questionEssayService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'questionEssayListModification',
        content: 'Deleted an questionEssay'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-question-essay-delete-popup',
  template: ''
})
export class QuestionEssayDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionEssay }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(QuestionEssayDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.questionEssay = questionEssay;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/question-essay', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/question-essay', { outlets: { popup: null } }]);
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
