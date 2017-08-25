import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { KavsirQuestionChoiceModule } from './question-choice/question-choice.module';
import { KavsirCategoryAcademicYearModule } from './category-academic-year/category-academic-year.module';
import { KavsirCategoryNodeModule } from './category-node/category-node.module';
import { KavsirCategorySourceModule } from './category-source/category-source.module';
import { KavsirCategorySemesterModule } from './category-semester/category-semester.module';
import { KavsirCategorySubjectModule } from './category-subject/category-subject.module';
import { KavsirCategoryGradeModule } from './category-grade/category-grade.module';
import { KavsirQuestionChoiceOptionModule } from './question-choice-option/question-choice-option.module';
import { KavsirQuestionEssayModule } from './question-essay/question-essay.module';
import { KavsirQuestionGroupModule } from './question-group/question-group.module';
import { KavsirQuestionTrueFalseModule } from './question-true-false/question-true-false.module';
import { KavsirResourceImageModule } from './resource-image/resource-image.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        KavsirQuestionChoiceModule,
        KavsirCategoryAcademicYearModule,
        KavsirCategoryNodeModule,
        KavsirCategorySourceModule,
        KavsirCategorySemesterModule,
        KavsirCategorySubjectModule,
        KavsirCategoryGradeModule,
        KavsirQuestionChoiceOptionModule,
        KavsirQuestionEssayModule,
        KavsirQuestionGroupModule,
        KavsirQuestionTrueFalseModule,
        KavsirResourceImageModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirEntityModule {}
