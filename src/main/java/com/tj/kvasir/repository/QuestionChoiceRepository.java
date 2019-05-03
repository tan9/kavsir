package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionChoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the QuestionChoice entity.
 */
@Repository
public interface QuestionChoiceRepository extends JpaRepository<QuestionChoice, Long> {

    @Query(value = "select distinct questionChoice from QuestionChoice questionChoice left join fetch questionChoice.categories left join fetch questionChoice.images",
        countQuery = "select count(distinct questionChoice) from QuestionChoice questionChoice")
    Page<QuestionChoice> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct questionChoice from QuestionChoice questionChoice left join fetch questionChoice.categories left join fetch questionChoice.images")
    List<QuestionChoice> findAllWithEagerRelationships();

    @Query("select questionChoice from QuestionChoice questionChoice left join fetch questionChoice.categories left join fetch questionChoice.images where questionChoice.id =:id")
    Optional<QuestionChoice> findOneWithEagerRelationships(@Param("id") Long id);

}
