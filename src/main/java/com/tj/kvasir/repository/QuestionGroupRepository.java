package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the QuestionGroup entity.
 */
@Repository
public interface QuestionGroupRepository extends JpaRepository<QuestionGroup, Long> {

    @Query(value = "select distinct questionGroup from QuestionGroup questionGroup left join fetch questionGroup.categories",
        countQuery = "select count(distinct questionGroup) from QuestionGroup questionGroup")
    Page<QuestionGroup> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct questionGroup from QuestionGroup questionGroup left join fetch questionGroup.categories")
    List<QuestionGroup> findAllWithEagerRelationships();

    @Query("select questionGroup from QuestionGroup questionGroup left join fetch questionGroup.categories where questionGroup.id =:id")
    Optional<QuestionGroup> findOneWithEagerRelationships(@Param("id") Long id);

}
