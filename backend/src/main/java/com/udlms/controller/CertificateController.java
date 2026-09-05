package com.udlms.controller;

import com.udlms.model.Certificate;
import com.udlms.repository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateRepository certificateRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificateById(@PathVariable String id) {
        Optional<Certificate> cert = certificateRepository.findById(id);
        return cert.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<Certificate> verifyByCertificateNumber(@PathVariable String code) {
        Optional<Certificate> cert = certificateRepository.findByCertificateNumber(code);
        return cert.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
