import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IQuestionChoice, QuestionChoice } from 'app/shared/model/question-choice.model';
import { QuestionChoiceService } from './question-choice.service';
import { ICategoryNode } from 'app/shared/model/category-node.model';
import { IResourceImage } from 'app/shared/model/resource-image.model';
import { IQuestionGroup } from 'app/shared/model/question-group.model';
import { QuestionGroupService } from 'app/entities/question-group';
import { QuestionChoiceOptionService } from '../question-choice-option/question-choice-option.service';
import { CategoryHierarchyService, ChoiceOptionsComponent } from 'app/shared';
import { IQuestionChoiceOption } from 'app/shared/model/question-choice-option.model';

@Component({
  selector: 'jhi-question-choice-update',
  templateUrl: './question-choice-update.component.html'
})
export class QuestionChoiceUpdateComponent implements OnInit {
  isSaving: boolean;
  inGroup = false;
  multi: boolean; /* valid values: true, false, undefined (not specified) */

  showPreview = false;
  min = 4;

  categorynodes: ICategoryNode[];

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

  aggregatedImages: IResourceImage[];

  @ViewChild(forwardRef(() => ChoiceOptionsComponent)) options: ChoiceOptionsComponent;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected questionChoiceService: QuestionChoiceService,
    protected questionChoiceOptionService: QuestionChoiceOptionService,
    protected categoryHierarchyService: CategoryHierarchyService,
    protected questionGroupService: QuestionGroupService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  optionAnswerValid() {
    return !this.options || (this.options.choiceOptions && this.options.choiceOptions.some(option => option.correct));
  }

  optionAnswerForSingleChoiceValid() {
    return (
      this.questionChoice.multipleResponse ||
      (this.options.choiceOptions && this.options.choiceOptions.filter(option => option.correct).length <= 1)
    );
  }

  optionNumberValid() {
    return !this.options || (this.options.choiceOptions && this.options.choiceOptions.length >= 4);
  }

  ngOnInit() {
    this.isSaving = false;
    this.inGroup = this.activatedRoute.snapshot.queryParams['group'] !== 'false';
    const multi = this.activatedRoute.snapshot.queryParams['multi'];
    if (multi !== undefined) {
      this.multi = 'true' === multi;
      this.questionChoice.multipleResponse = this.multi;
    }
    if (
      this.categoryHierarchyService.getWorkingCategory() &&
      (!this.questionChoice.categories || this.questionChoice.categories.length === 0)
    ) {
      this.questionChoice.categories = [this.categoryHierarchyService.getWorkingCategory()];
    }
    this.activatedRoute.data.subscribe(({ questionChoice }) => {
      this.updateForm(questionChoice);
    });

    this.initAggregatedImages();

    this.categorynodes = this.categoryHierarchyService.getNodes();
    this.questionGroupService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IQuestionGroup[]>) => mayBeOk.ok),
        map((response: HttpResponse<IQuestionGroup[]>) => response.body)
      )
      .subscribe((res: IQuestionGroup[]) => (this.questiongroups = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  private initAggregatedImages(): void {
    // merge images from question, options into one aggregated array
    let images: IResourceImage[] = [];
    this.pushAll(images, this.questionChoice.images);
    this.questionChoice.options.forEach((option: IQuestionChoiceOption) => this.pushAll(images, option.images));

    images = images.filter((image, index) => image.id === undefined || images.findIndex(img => img.id === image.id) === index);
    this.aggregatedImages = images;

    // sync all related entities with the same images array
    this.questionChoice.images = this.aggregatedImages;
    this.questionChoice.options.forEach((option: IQuestionChoiceOption) => (option.images = this.aggregatedImages));
  }

  private pushAll(container: IResourceImage[], elements: IResourceImage[]) {
    Array.prototype.push.apply(container, elements);
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
    this.options.editable = false;
    const questionChoice = this.createFromForm();
    if (questionChoice.id !== undefined) {
      this.subscribeToSaveResponse(this.questionChoiceService.update(questionChoice));
    } else {
      this.subscribeToSaveResponse(this.questionChoiceService.create(questionChoice));
    }
  }

  private saveOptions(questionChoice: IQuestionChoice): Promise<any> {
    // TODO use Observable instead?
    const promises: Promise<any>[] = [];

    this.options.choiceOptions.forEach(option => {
      option.questionChoiceId = questionChoice.id;
      if (option.id) {
        promises.push(this.questionChoiceOptionService.update(option).toPromise());
      } else {
        promises.push(this.questionChoiceOptionService.create(option).toPromise());
      }
    });
    this.options.optionsDeleted.forEach(option => {
      if (option.id) {
        promises.push(this.questionChoiceOptionService.delete(option.id).toPromise());
      }
    });

    return Promise.all(promises);
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
    result.subscribe(
      (res: HttpResponse<IQuestionChoice>) => this.saveOptions(res.body).then(() => this.onSaveSuccess(), () => this.onSaveError()),
      (res: HttpErrorResponse) => this.onSaveError
    );
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
