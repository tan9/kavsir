package com.tj.kvasir.repository;

import com.tj.kvasir.domain.QuestionGroup;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the QuestionGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionGroupRepository extends JpaRepository<QuestionGroup, Long> {
    @Query("select distinct question_group from QuestionGroup question_group left join fetch question_group.categories")
    List<QuestionGroup> findAllWithEagerRelationships();

    @Query("select question_group from QuestionGroup question_group left join fetch question_group.categories where question_group.id =:id")
    QuestionGroup findOneWithEagerRelationships(@Param("id") Long id);

}
