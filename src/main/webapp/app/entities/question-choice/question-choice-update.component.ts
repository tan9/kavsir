import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IQuestionChoice, QuestionChoice } from 'app/shared/model/question-choice.model';
import { QuestionChoiceService } from './question-choice.service';
import { ICategoryNode } from 'app/shared/model/category-node.model';
import { CategoryNodeService } from 'app/entities/category-node';
import { IResourceImage } from 'app/shared/model/resource-image.model';
import { ResourceImageService } from 'app/entities/resource-image';
import { IQuestionGroup } from 'app/shared/model/question-group.model';
import { QuestionGroupService } from 'app/entities/question-group';

@Component({
  selector: 'jhi-question-choice-update',
  templateUrl: './question-choice-update.component.html'
})
export class QuestionChoiceUpdateComponent implements OnInit {
  questionChoice: IQuestionChoice;
  isSaving: boolean;

  categorynodes: ICategoryNode[];

  resourceimages: IResourceImage[];

  questiongroups: IQuestionGroup[];

  editForm = this.fb.group({
    id: [],
    multipleResponse: [null, [Validators.required]],
    text: [null, [Validators.required]],
    memo: [],
    groupPosition: [],
    categories: [],
    images: [],
    questionGroupId: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected questionChoiceService: QuestionChoiceService,
    protected categoryNodeService: CategoryNodeService,
    protected resourceImageService: ResourceImageService,
    protected questionGroupService: QuestionGroupService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ questionChoice }) => {
      this.updateForm(questionChoice);
      this.questionChoice = questionChoice;
    });
    this.categoryNodeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICategoryNode[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICategoryNode[]>) => response.body)
      )
      .subscribe((res: ICategoryNode[]) => (this.categorynodes = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.resourceImageService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IResourceImage[]>) => mayBeOk.ok),
        map((response: HttpResponse<IResourceImage[]>) => response.body)
      )
      .subscribe((res: IResourceImage[]) => (this.resourceimages = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.questionGroupService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionGroup[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionGroup[]>) => response.body)
      )
      .subscribe((res: IQuestionGroup[]) => (this.questiongroups = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(questionChoice: IQuestionChoice) {
    this.editForm.patchValue({
      id: questionChoice.id,
      multipleResponse: questionChoice.multipleResponse,
      text: questionChoice.text,
      memo: questionChoice.memo,
      groupPosition: questionChoice.groupPosition,
      categories: questionChoice.categories,
      images: questionChoice.images,
      questionGroupId: questionChoice.questionGroupId
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        if (isImage && !/^image\//.test(file.type)) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      () => console.log('blob added'), // sucess
      this.onError
    );
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const questionChoice = this.createFromForm();
    if (questionChoice.id !== undefined) {
      this.subscribeToSaveResponse(this.questionChoiceService.update(questionChoice));
    } else {
      this.subscribeToSaveResponse(this.questionChoiceService.create(questionChoice));
    }
  }

  private createFromForm(): IQuestionChoice {
    const entity = {
      ...new QuestionChoice(),
      id: this.editForm.get(['id']).value,
      multipleResponse: this.editForm.get(['multipleResponse']).value,
      text: this.editForm.get(['text']).value,
      memo: this.editForm.get(['memo']).value,
      groupPosition: this.editForm.get(['groupPosition']).value,
      categories: this.editForm.get(['categories']).value,
      images: this.editForm.get(['images']).value,
      questionGroupId: this.editForm.get(['questionGroupId']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestionChoice>>) {
    result.subscribe((res: HttpResponse<IQuestionChoice>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackResourceImageById(index: number, item: IResourceImage) {
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
