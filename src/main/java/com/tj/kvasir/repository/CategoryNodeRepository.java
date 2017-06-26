package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.Set;

/**
 * Spring Data JPA repository for the CategoryNode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryNodeRepository extends JpaRepository<CategoryNode,Long> {

    // TODO Shouldn't the id in type of Long?
    @Query(name = "CategoryNode.findAllChildNodes", nativeQuery = true)
    Set<BigInteger> findAllChildNodes(@Param("categoryIds") Set<? extends Number> categoryIds);

}
