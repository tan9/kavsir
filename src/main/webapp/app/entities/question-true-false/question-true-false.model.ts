import { CategoryNode } from '../category-node';
import { ResourceImage } from '../resource-image';
import { QuestionGroup } from '../question-group';
export class QuestionTrueFalse {
    constructor(
        public id?: number,
        public correct?: boolean,
        public text?: string,
        public memo?: string,
        public groupPosition?: number,
        public category?: CategoryNode,
        public image?: ResourceImage,
        public questionGroup?: QuestionGroup,
    ) {
        this.correct = false; 
    }
}
