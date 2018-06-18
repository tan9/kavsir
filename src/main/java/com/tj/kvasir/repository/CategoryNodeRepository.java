package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryNode;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the CategoryNode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryNodeRepository extends JpaRepository<CategoryNode, Long> {

}
