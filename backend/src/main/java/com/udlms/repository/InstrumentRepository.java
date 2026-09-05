package com.udlms.repository;

import com.udlms.model.Instrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, String> {
    List<Instrument> findByStatus(String status);
    List<Instrument> findByOwnerName(String ownerName);
}
