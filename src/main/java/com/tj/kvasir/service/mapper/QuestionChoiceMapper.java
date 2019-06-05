package com.tj.kvasir.service.mapper;

import com.tj.kvasir.domain.*;
import com.tj.kvasir.service.dto.QuestionChoiceDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link QuestionChoice} and its DTO {@link QuestionChoiceDTO}.
 */
@Mapper(componentModel = "spring", uses = {CategoryNodeMapper.class, ResourceImageMapper.class, QuestionGroupMapper.class})
public interface QuestionChoiceMapper extends EntityMapper<QuestionChoiceDTO, QuestionChoice> {

    @Mapping(source = "questionGroup.id", target = "questionGroupId")
    QuestionChoiceDTO toDto(QuestionChoice questionChoice);

    @Mapping(target = "options", ignore = true)
    @Mapping(source = "questionGroupId", target = "questionGroup")
    QuestionChoice toEntity(QuestionChoiceDTO questionChoiceDTO);

    default QuestionChoice fromId(Long id) {
        if (id == null) {
            return null;
        }
        QuestionChoice questionChoice = new QuestionChoice();
        questionChoice.setId(id);
        return questionChoice;
    }
}
