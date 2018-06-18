package com.tj.kvasir.service.mapper;

import com.tj.kvasir.domain.*;
import com.tj.kvasir.service.dto.QuestionChoiceOptionDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity QuestionChoiceOption and its DTO QuestionChoiceOptionDTO.
 */
@Mapper(componentModel = "spring", uses = {QuestionChoiceMapper.class, ResourceImageMapper.class})
public interface QuestionChoiceOptionMapper extends EntityMapper<QuestionChoiceOptionDTO, QuestionChoiceOption> {

    @Mapping(source = "questionChoice.id", target = "questionChoiceId")
    QuestionChoiceOptionDTO toDto(QuestionChoiceOption questionChoiceOption);

    @Mapping(source = "questionChoiceId", target = "questionChoice")
    QuestionChoiceOption toEntity(QuestionChoiceOptionDTO questionChoiceOptionDTO);

    default QuestionChoiceOption fromId(Long id) {
        if (id == null) {
            return null;
        }
        QuestionChoiceOption questionChoiceOption = new QuestionChoiceOption();
        questionChoiceOption.setId(id);
        return questionChoiceOption;
    }
}
