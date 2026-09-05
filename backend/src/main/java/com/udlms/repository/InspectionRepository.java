package com.udlms.repository;

import com.udlms.model.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, String> {
    List<Inspection> findByStatus(String status);
}
