import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'category-academic-year',
        loadChildren: './category-academic-year/category-academic-year.module#KavsirCategoryAcademicYearModule'
      },
      {
        path: 'category-grade',
        loadChildren: './category-grade/category-grade.module#KavsirCategoryGradeModule'
      },
      {
        path: 'category-node',
        loadChildren: './category-node/category-node.module#KavsirCategoryNodeModule'
      },
      {
        path: 'category-semester',
        loadChildren: './category-semester/category-semester.module#KavsirCategorySemesterModule'
      },
      {
        path: 'category-subject',
        loadChildren: './category-subject/category-subject.module#KavsirCategorySubjectModule'
      },
      {
        path: 'question-choice',
        loadChildren: './question-choice/question-choice.module#KavsirQuestionChoiceModule'
      },
      {
        path: 'question-choice-option',
        loadChildren: './question-choice-option/question-choice-option.module#KavsirQuestionChoiceOptionModule'
      },
      {
        path: 'question-essay',
        loadChildren: './question-essay/question-essay.module#KavsirQuestionEssayModule'
      },
      {
        path: 'question-group',
        loadChildren: './question-group/question-group.module#KavsirQuestionGroupModule'
      },
      {
        path: 'question-true-false',
        loadChildren: './question-true-false/question-true-false.module#KavsirQuestionTrueFalseModule'
      },
      {
        path: 'resource-image',
        loadChildren: './resource-image/resource-image.module#KavsirResourceImageModule'
      },
      {
        path: 'category-source',
        loadChildren: './category-source/category-source.module#KavsirCategorySourceModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirEntityModule {}
