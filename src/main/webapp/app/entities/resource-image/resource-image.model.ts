import { QuestionChoice } from '../question-choice';
import { QuestionChoiceOption } from '../question-choice-option';
import { QuestionTrueFalse } from '../question-true-false';
import { QuestionEssay } from '../question-essay';
export class ResourceImage {
    constructor(
        public id?: number,
        public name?: string,
        public contentContentType?: string,
        public content?: any,
        public choice?: QuestionChoice,
        public choiceOption?: QuestionChoiceOption,
        public trueFalse?: QuestionTrueFalse,
        public essay?: QuestionEssay,
    ) {
    }
}
