import { QuestionChoice } from '../question-choice';
import { QuestionTrueFalse } from '../question-true-false';
import { QuestionEssay } from '../question-essay';
import { CategoryNode } from '../category-node';
export class QuestionGroup {
    constructor(
        public id?: number,
        public text?: string,
        public memo?: string,
        public choice?: QuestionChoice,
        public trueFalse?: QuestionTrueFalse,
        public essay?: QuestionEssay,
        public category?: CategoryNode,
    ) {
    }
}
