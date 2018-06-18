import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { KavsirQuestionChoiceModule } from './question-choice/question-choice.module';
import { KavsirCategoryAcademicYearModule } from './category-academic-year/category-academic-year.module';
import { KavsirCategoryNodeModule } from './category-node/category-node.module';
import { KavsirCategorySemesterModule } from './category-semester/category-semester.module';
import { KavsirQuestionTrueFalseModule } from './question-true-false/question-true-false.module';
import { KavsirCategorySubjectModule } from './category-subject/category-subject.module';
import { KavsirCategoryGradeModule } from './category-grade/category-grade.module';
import { KavsirQuestionChoiceOptionModule } from './question-choice-option/question-choice-option.module';
import { KavsirQuestionEssayModule } from './question-essay/question-essay.module';
import { KavsirQuestionGroupModule } from './question-group/question-group.module';
import { KavsirResourceImageModule } from './resource-image/resource-image.module';
import { KavsirCategorySourceModule } from './category-source/category-source.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        KavsirQuestionChoiceModule,
        KavsirCategoryAcademicYearModule,
        KavsirCategoryNodeModule,
        KavsirCategorySemesterModule,
        KavsirQuestionTrueFalseModule,
        KavsirCategorySubjectModule,
        KavsirCategoryGradeModule,
        KavsirQuestionChoiceOptionModule,
        KavsirQuestionEssayModule,
        KavsirQuestionGroupModule,
        KavsirResourceImageModule,
        KavsirCategorySourceModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirEntityModule {}
