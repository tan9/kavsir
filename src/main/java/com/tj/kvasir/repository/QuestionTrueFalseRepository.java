package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionTrueFalse;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the QuestionTrueFalse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionTrueFalseRepository extends JpaRepository<QuestionTrueFalse, Long> {
    @Query("select distinct question_true_false from QuestionTrueFalse question_true_false left join fetch question_true_false.categories left join fetch question_true_false.images")
    List<QuestionTrueFalse> findAllWithEagerRelationships();

    @Query("select question_true_false from QuestionTrueFalse question_true_false left join fetch question_true_false.categories left join fetch question_true_false.images where question_true_false.id =:id")
    QuestionTrueFalse findOneWithEagerRelationships(@Param("id") Long id);

}
