import { CategoryNode } from '../category-node';
import { ResourceImage } from '../resource-image';
import { QuestionGroup } from '../question-group';
export class QuestionEssay {
    constructor(
        public id?: number,
        public text?: string,
        public answer?: string,
        public memo?: string,
        public groupPosition?: number,
        public category?: CategoryNode,
        public image?: ResourceImage,
        public questionGroup?: QuestionGroup,
    ) {
    }
}
