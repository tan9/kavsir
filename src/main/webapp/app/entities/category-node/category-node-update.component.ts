import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICategoryNode, CategoryNode } from 'app/shared/model/category-node.model';
import { CategoryNodeService } from './category-node.service';
import { IQuestionTrueFalse } from 'app/shared/model/question-true-false.model';
import { QuestionTrueFalseService } from 'app/entities/question-true-false';
import { IQuestionChoice } from 'app/shared/model/question-choice.model';
import { QuestionChoiceService } from 'app/entities/question-choice';
import { IQuestionEssay } from 'app/shared/model/question-essay.model';
import { QuestionEssayService } from 'app/entities/question-essay';
import { IQuestionGroup } from 'app/shared/model/question-group.model';
import { QuestionGroupService } from 'app/entities/question-group';

@Component({
  selector: 'jhi-category-node-update',
  templateUrl: './category-node-update.component.html'
})
export class CategoryNodeUpdateComponent implements OnInit {
  isSaving: boolean;

  categorynodes: ICategoryNode[];

  questiontruefalses: IQuestionTrueFalse[];

  questionchoices: IQuestionChoice[];

  questionessays: IQuestionEssay[];

  questiongroups: IQuestionGroup[];

  editForm = this.fb.group({
    id: [],
    type: [null, [Validators.required]],
    typeId: [],
    name: [],
    position: [],
    parentId: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected categoryNodeService: CategoryNodeService,
    protected questionTrueFalseService: QuestionTrueFalseService,
    protected questionChoiceService: QuestionChoiceService,
    protected questionEssayService: QuestionEssayService,
    protected questionGroupService: QuestionGroupService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ categoryNode }) => {
      this.updateForm(categoryNode);
    });
    this.categoryNodeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICategoryNode[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICategoryNode[]>) => response.body)
      )
      .subscribe((res: ICategoryNode[]) => (this.categorynodes = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.questionTrueFalseService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionTrueFalse[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionTrueFalse[]>) => response.body)
      )
      .subscribe((res: IQuestionTrueFalse[]) => (this.questiontruefalses = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.questionChoiceService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionChoice[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionChoice[]>) => response.body)
      )
      .subscribe((res: IQuestionChoice[]) => (this.questionchoices = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.questionEssayService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionEssay[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionEssay[]>) => response.body)
      )
      .subscribe((res: IQuestionEssay[]) => (this.questionessays = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.questionGroupService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionGroup[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionGroup[]>) => response.body)
      )
      .subscribe((res: IQuestionGroup[]) => (this.questiongroups = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(categoryNode: ICategoryNode) {
    this.editForm.patchValue({
      id: categoryNode.id,
      type: categoryNode.type,
      typeId: categoryNode.typeId,
      name: categoryNode.name,
      position: categoryNode.position,
      parentId: categoryNode.parentId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const categoryNode = this.createFromForm();
    if (categoryNode.id !== undefined) {
      this.subscribeToSaveResponse(this.categoryNodeService.update(categoryNode));
    } else {
      this.subscribeToSaveResponse(this.categoryNodeService.create(categoryNode));
    }
  }

  private createFromForm(): ICategoryNode {
    const entity = {
      ...new CategoryNode(),
      id: this.editForm.get(['id']).value,
      type: this.editForm.get(['type']).value,
      typeId: this.editForm.get(['typeId']).value,
      name: this.editForm.get(['name']).value,
      position: this.editForm.get(['position']).value,
      parentId: this.editForm.get(['parentId']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategoryNode>>) {
    result.subscribe((res: HttpResponse<ICategoryNode>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackCategoryNodeById(index: number, item: ICategoryNode) {
    return item.id;
  }

  trackQuestionTrueFalseById(index: number, item: IQuestionTrueFalse) {
    return item.id;
  }

  trackQuestionChoiceById(index: number, item: IQuestionChoice) {
    return item.id;
  }

  trackQuestionEssayById(index: number, item: IQuestionEssay) {
    return item.id;
  }

  trackQuestionGroupById(index: number, item: IQuestionGroup) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
