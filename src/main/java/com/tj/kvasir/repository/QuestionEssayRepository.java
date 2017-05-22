package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionEssay;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the QuestionEssay entity.
 */
@SuppressWarnings("unused")
public interface QuestionEssayRepository extends JpaRepository<QuestionEssay,Long> {

    @Query("select distinct questionEssay from QuestionEssay questionEssay left join fetch questionEssay.categories left join fetch questionEssay.images")
    List<QuestionEssay> findAllWithEagerRelationships();

    @Query("select questionEssay from QuestionEssay questionEssay left join fetch questionEssay.categories left join fetch questionEssay.images where questionEssay.id =:id")
    QuestionEssay findOneWithEagerRelationships(@Param("id") Long id);

}
