package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryNode;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CategoryNode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryNodeRepository extends JpaRepository<CategoryNode, Long> {

}
