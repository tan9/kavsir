package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionChoiceOption;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the QuestionChoiceOption entity.
 */
@Repository
public interface QuestionChoiceOptionRepository extends JpaRepository<QuestionChoiceOption, Long> {

    @Query(value = "select distinct questionChoiceOption from QuestionChoiceOption questionChoiceOption left join fetch questionChoiceOption.images",
        countQuery = "select count(distinct questionChoiceOption) from QuestionChoiceOption questionChoiceOption")
    Page<QuestionChoiceOption> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct questionChoiceOption from QuestionChoiceOption questionChoiceOption left join fetch questionChoiceOption.images")
    List<QuestionChoiceOption> findAllWithEagerRelationships();

    @Query("select questionChoiceOption from QuestionChoiceOption questionChoiceOption left join fetch questionChoiceOption.images where questionChoiceOption.id =:id")
    Optional<QuestionChoiceOption> findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT question_choice_option FROM QuestionChoiceOption question_choice_option WHERE question_choice_option.questionChoice.id = :questionId")
    List<QuestionChoiceOption> findAllByQuestionChoice(@Param("questionId") Long questionId);

}
