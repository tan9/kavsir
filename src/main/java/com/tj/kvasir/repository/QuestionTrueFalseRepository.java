package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionTrueFalse;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the QuestionTrueFalse entity.
 */
@SuppressWarnings("unused")
public interface QuestionTrueFalseRepository extends JpaRepository<QuestionTrueFalse,Long> {

    @Query("select distinct questionTrueFalse from QuestionTrueFalse questionTrueFalse left join fetch questionTrueFalse.categories left join fetch questionTrueFalse.images")
    List<QuestionTrueFalse> findAllWithEagerRelationships();

    @Query("select questionTrueFalse from QuestionTrueFalse questionTrueFalse left join fetch questionTrueFalse.categories left join fetch questionTrueFalse.images where questionTrueFalse.id =:id")
    QuestionTrueFalse findOneWithEagerRelationships(@Param("id") Long id);

}
