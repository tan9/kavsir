import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IQuestionTrueFalse, QuestionTrueFalse } from 'app/shared/model/question-true-false.model';
import { QuestionTrueFalseService } from './question-true-false.service';
import { ICategoryNode } from 'app/shared/model/category-node.model';
import { IResourceImage } from 'app/shared/model/resource-image.model';
import { ResourceImageService } from 'app/entities/resource-image';
import { IQuestionGroup } from 'app/shared/model/question-group.model';
import { QuestionGroupService } from 'app/entities/question-group';
import { CategoryHierarchyService } from 'app/shared';
import { ImagesComponent } from '../../shared/image/images.component';

@Component({
  selector: 'jhi-question-true-false-update',
  templateUrl: './question-true-false-update.component.html'
})
export class QuestionTrueFalseUpdateComponent implements OnInit {
  isSaving: boolean;
  inGroup = true;

  showPreview = false;

  categorynodes: ICategoryNode[];

  resourceimages: IResourceImage[];

  questiongroups: IQuestionGroup[];

  @ViewChild(forwardRef(() => ImagesComponent)) images: ImagesComponent;

  editForm = this.fb.group({
    id: [],
    correct: [null, [Validators.required]],
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
    protected questionTrueFalseService: QuestionTrueFalseService,
    protected categoryHierarchyService: CategoryHierarchyService,
    protected resourceImageService: ResourceImageService,
    protected questionGroupService: QuestionGroupService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.inGroup = this.activatedRoute.snapshot.queryParams['group'] !== 'false';
    this.activatedRoute.data.subscribe(({ questionTrueFalse }) => {
      this.updateForm(questionTrueFalse);
    });

    if (
      this.categoryHierarchyService.getWorkingCategory() &&
      (!this.questionTrueFalse.categories || this.questionTrueFalse.categories.length === 0)
    ) {
      this.questionTrueFalse.categories = [this.categoryHierarchyService.getWorkingCategory()];
    }

    this.categorynodes = this.categoryHierarchyService.getNodes();
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

  updateForm(questionTrueFalse: IQuestionTrueFalse) {
    this.editForm.patchValue({
      id: questionTrueFalse.id,
      correct: questionTrueFalse.correct,
      text: questionTrueFalse.text,
      memo: questionTrueFalse.memo,
      groupPosition: questionTrueFalse.groupPosition,
      categories: questionTrueFalse.categories,
      images: questionTrueFalse.images,
      questionGroupId: questionTrueFalse.questionGroupId
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
    const questionTrueFalse = this.createFromForm();
    if (questionTrueFalse.id !== undefined) {
      this.subscribeToSaveResponse(this.questionTrueFalseService.update(questionTrueFalse));
    } else {
      this.subscribeToSaveResponse(this.questionTrueFalseService.create(questionTrueFalse));
    }
  }

  private createFromForm(): IQuestionTrueFalse {
    const entity = {
      ...new QuestionTrueFalse(),
      id: this.editForm.get(['id']).value,
      correct: this.editForm.get(['correct']).value,
      text: this.editForm.get(['text']).value,
      memo: this.editForm.get(['memo']).value,
      groupPosition: this.editForm.get(['groupPosition']).value,
      categories: this.editForm.get(['categories']).value,
      images: this.editForm.get(['images']).value,
      questionGroupId: this.editForm.get(['questionGroupId']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestionTrueFalse>>) {
    result.subscribe((res: HttpResponse<IQuestionTrueFalse>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
