package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategorySubject;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CategorySubject entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategorySubjectRepository extends JpaRepository<CategorySubject, Long> {

}
