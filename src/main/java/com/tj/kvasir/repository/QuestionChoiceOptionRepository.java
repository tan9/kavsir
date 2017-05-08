package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionChoiceOption;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the QuestionChoiceOption entity.
 */
@SuppressWarnings("unused")
public interface QuestionChoiceOptionRepository extends JpaRepository<QuestionChoiceOption,Long> {

    @Query("select distinct questionChoiceOption from QuestionChoiceOption questionChoiceOption left join fetch questionChoiceOption.images")
    List<QuestionChoiceOption> findAllWithEagerRelationships();

    @Query("select questionChoiceOption from QuestionChoiceOption questionChoiceOption left join fetch questionChoiceOption.images where questionChoiceOption.id =:id")
    QuestionChoiceOption findOneWithEagerRelationships(@Param("id") Long id);

}
