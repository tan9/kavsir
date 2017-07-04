package com.tj.kvasir.service.mapper;

import com.tj.kvasir.domain.*;
import com.tj.kvasir.service.dto.QuestionGroupDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity QuestionGroup and its DTO QuestionGroupDTO.
 */
@Mapper(componentModel = "spring", uses = {CategoryNodeMapper.class, })
public interface QuestionGroupMapper extends EntityMapper <QuestionGroupDTO, QuestionGroup> {
    
    @Mapping(target = "choices", ignore = true)
    @Mapping(target = "trueFalses", ignore = true)
    @Mapping(target = "essays", ignore = true)
    QuestionGroup toEntity(QuestionGroupDTO questionGroupDTO); 
    default QuestionGroup fromId(Long id) {
        if (id == null) {
            return null;
        }
        QuestionGroup questionGroup = new QuestionGroup();
        questionGroup.setId(id);
        return questionGroup;
    }
}
