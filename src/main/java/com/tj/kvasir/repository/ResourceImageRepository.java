package com.tj.kvasir.repository;

import com.tj.kvasir.domain.ResourceImage;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ResourceImage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ResourceImageRepository extends JpaRepository<ResourceImage, Long> {

}
