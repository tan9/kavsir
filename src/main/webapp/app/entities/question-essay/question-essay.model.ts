import { BaseEntity } from './../../shared';

export class QuestionEssay implements BaseEntity {
    constructor(
        public id?: number,
        public text?: any,
        public answer?: any,
        public memo?: string,
        public groupPosition?: number,
        public categories?: BaseEntity[],
        public images?: BaseEntity[],
        public questionGroup?: BaseEntity,
    ) {
    }
}
