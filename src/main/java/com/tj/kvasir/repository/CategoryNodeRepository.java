package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryNode;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the CategoryNode entity.
 */
@SuppressWarnings("unused")
public interface CategoryNodeRepository extends JpaRepository<CategoryNode,Long> {

}
