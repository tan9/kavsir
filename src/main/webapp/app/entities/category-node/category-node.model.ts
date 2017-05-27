
const enum CategoryType {
    'ACADEMIC_YEAR',
    'GRADE',
    'SEMESTER',
    'SUBJECT',
    'PUBLISHER',
    'SEGMENT'

};
import { QuestionTrueFalse } from '../question-true-false';
import { QuestionChoice } from '../question-choice';
import { QuestionEssay } from '../question-essay';
import { QuestionGroup } from '../question-group';
export class CategoryNode {
    constructor(
        public id?: number,
        public type?: CategoryType,
        public typeId?: number,
        public name?: string,
        public position?: number,
        public parent?: CategoryNode,
        public trueOrFalse?: QuestionTrueFalse,
        public choice?: QuestionChoice,
        public essay?: QuestionEssay,
        public group?: QuestionGroup,
    ) {
    }
}