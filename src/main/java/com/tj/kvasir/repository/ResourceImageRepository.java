package com.tj.kvasir.repository;

import com.tj.kvasir.domain.ResourceImage;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ResourceImage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ResourceImageRepository extends JpaRepository<ResourceImage, Long> {

}
