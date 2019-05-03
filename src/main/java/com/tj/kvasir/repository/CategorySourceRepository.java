package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategorySource;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CategorySource entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategorySourceRepository extends JpaRepository<CategorySource, Long> {

}
