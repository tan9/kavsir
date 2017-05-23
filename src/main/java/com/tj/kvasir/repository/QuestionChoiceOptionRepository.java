package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionChoiceOption;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the QuestionChoiceOption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionChoiceOptionRepository extends JpaRepository<QuestionChoiceOption,Long> {

    @Query("select distinct question_choice_option from QuestionChoiceOption question_choice_option left join fetch question_choice_option.images")
    List<QuestionChoiceOption> findAllWithEagerRelationships();

    @Query("select question_choice_option from QuestionChoiceOption question_choice_option left join fetch question_choice_option.images where question_choice_option.id =:id")
    QuestionChoiceOption findOneWithEagerRelationships(@Param("id") Long id);

}
