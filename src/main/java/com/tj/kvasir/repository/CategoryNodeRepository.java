package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryNode;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

/**
 * Spring Data  repository for the CategoryNode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryNodeRepository extends JpaRepository<CategoryNode, Long> {

    @Query(name = "CategoryNode.findAllChildNodes", nativeQuery = true)
    Set<CategoryNode> findAllChildNodes(@Param("categoryIds") Set<Long> categoryIds);

}
