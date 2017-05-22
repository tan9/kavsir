package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionChoice;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the QuestionChoice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionChoiceRepository extends JpaRepository<QuestionChoice,Long> {

    @Query("select distinct question_choice from QuestionChoice question_choice left join fetch question_choice.categories left join fetch question_choice.images")
    List<QuestionChoice> findAllWithEagerRelationships();

    @Query("select question_choice from QuestionChoice question_choice left join fetch question_choice.categories left join fetch question_choice.images where question_choice.id =:id")
    QuestionChoice findOneWithEagerRelationships(@Param("id") Long id);

}
