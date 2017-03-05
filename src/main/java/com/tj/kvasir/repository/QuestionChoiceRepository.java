package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionChoice;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the QuestionChoice entity.
 */
@SuppressWarnings("unused")
public interface QuestionChoiceRepository extends JpaRepository<QuestionChoice,Long> {

    @Query("select distinct questionChoice from QuestionChoice questionChoice left join fetch questionChoice.categories left join fetch questionChoice.images")
    List<QuestionChoice> findAllWithEagerRelationships();

    @Query("select questionChoice from QuestionChoice questionChoice left join fetch questionChoice.categories left join fetch questionChoice.images where questionChoice.id =:id")
    QuestionChoice findOneWithEagerRelationships(@Param("id") Long id);

}
