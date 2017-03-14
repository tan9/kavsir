import { QuestionChoiceOption } from '../question-choice-option';
import { CategoryNode } from '../category-node';
import { ResourceImage } from '../resource-image';
import { QuestionGroup } from '../question-group';
export class QuestionChoice {
    constructor(
        public id?: number,
        public multipleResponse?: boolean,
        public text?: string,
        public memo?: string,
        public groupPosition?: number,
        public option?: QuestionChoiceOption,
        public category?: CategoryNode,
        public image?: ResourceImage,
        public questionGroup?: QuestionGroup,
    ) {
        this.multipleResponse = false;
    }
}
