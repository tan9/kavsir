import { QuestionChoice } from '../question-choice';
import { ResourceImage } from '../resource-image';
export class QuestionChoiceOption {
    constructor(
        public id?: number,
        public correct?: boolean,
        public text?: string,
        public memo?: string,
        public questionChoice?: QuestionChoice,
        public image?: ResourceImage,
    ) {
        this.correct = false; 
    }
}
