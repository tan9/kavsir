package com.tj.kvasir.repository;

import com.tj.kvasir.domain.CategoryPublisher;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the CategoryPublisher entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryPublisherRepository extends JpaRepository<CategoryPublisher, Long> {

}
