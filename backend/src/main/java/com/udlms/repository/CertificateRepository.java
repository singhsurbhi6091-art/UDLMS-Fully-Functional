package com.udlms.repository;

import com.udlms.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, String> {
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    Optional<Certificate> findByInstrumentId(String instrumentId);
}
