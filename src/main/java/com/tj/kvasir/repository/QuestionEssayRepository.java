package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionEssay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the QuestionEssay entity.
 */
@Repository
public interface QuestionEssayRepository extends JpaRepository<QuestionEssay, Long> {

    @Query(value = "select distinct questionEssay from QuestionEssay questionEssay left join fetch questionEssay.categories left join fetch questionEssay.images",
        countQuery = "select count(distinct questionEssay) from QuestionEssay questionEssay")
    Page<QuestionEssay> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct questionEssay from QuestionEssay questionEssay left join fetch questionEssay.categories left join fetch questionEssay.images")
    List<QuestionEssay> findAllWithEagerRelationships();

    @Query("select questionEssay from QuestionEssay questionEssay left join fetch questionEssay.categories left join fetch questionEssay.images where questionEssay.id =:id")
    Optional<QuestionEssay> findOneWithEagerRelationships(@Param("id") Long id);

}
