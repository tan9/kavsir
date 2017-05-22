package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionGroup;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the QuestionGroup entity.
 */
@SuppressWarnings("unused")
public interface QuestionGroupRepository extends JpaRepository<QuestionGroup,Long> {

    @Query("select distinct questionGroup from QuestionGroup questionGroup left join fetch questionGroup.categories")
    List<QuestionGroup> findAllWithEagerRelationships();

    @Query("select questionGroup from QuestionGroup questionGroup left join fetch questionGroup.categories where questionGroup.id =:id")
    QuestionGroup findOneWithEagerRelationships(@Param("id") Long id);

}
