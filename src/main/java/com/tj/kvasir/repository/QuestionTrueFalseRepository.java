package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionTrueFalse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the QuestionTrueFalse entity.
 */
@Repository
public interface QuestionTrueFalseRepository extends JpaRepository<QuestionTrueFalse, Long> {

    @Query(value = "select distinct questionTrueFalse from QuestionTrueFalse questionTrueFalse left join fetch questionTrueFalse.categories left join fetch questionTrueFalse.images",
        countQuery = "select count(distinct questionTrueFalse) from QuestionTrueFalse questionTrueFalse")
    Page<QuestionTrueFalse> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct questionTrueFalse from QuestionTrueFalse questionTrueFalse left join fetch questionTrueFalse.categories left join fetch questionTrueFalse.images")
    List<QuestionTrueFalse> findAllWithEagerRelationships();

    @Query("select questionTrueFalse from QuestionTrueFalse questionTrueFalse left join fetch questionTrueFalse.categories left join fetch questionTrueFalse.images where questionTrueFalse.id =:id")
    Optional<QuestionTrueFalse> findOneWithEagerRelationships(@Param("id") Long id);

}
