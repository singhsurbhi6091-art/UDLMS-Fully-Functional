package com.udlms.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @Column(length = 50)
    private String id; // e.g. CERT-2026-8842

    @Column(name = "certificate_number", unique = true, nullable = false)
    private String certificateNumber;

    @Column(name = "instrument_id", length = 50, nullable = false)
    private String instrumentId;

    @Column(name = "instrument_name", nullable = false)
    private String instrumentName;

    @Column(nullable = false)
    private String capacity;

    @Column(name = "issued_to_org", nullable = false)
    private String issuedToOrg;

    @Column(name = "location_address", nullable = false)
    private String locationAddress;

    @Column(name = "issued_by_officer", nullable = false)
    private String issuedByOfficer;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate = LocalDate.now();

    @Column(name = "valid_until", nullable = false)
    private LocalDate validUntil;

    @Column(name = "qr_payload", columnDefinition = "TEXT")
    private String qrPayload;

    @Column(name = "is_valid")
    private Boolean isValid = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Certificate() {}

    public Certificate(String id, String certificateNumber, String instrumentId, String instrumentName, String capacity, String issuedToOrg, String locationAddress, String issuedByOfficer, LocalDate validUntil) {
        this.id = id;
        this.certificateNumber = certificateNumber;
        this.instrumentId = instrumentId;
        this.instrumentName = instrumentName;
        this.capacity = capacity;
        this.issuedToOrg = issuedToOrg;
        this.locationAddress = locationAddress;
        this.issuedByOfficer = issuedByOfficer;
        this.validUntil = validUntil;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCertificateNumber() { return certificateNumber; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }

    public String getInstrumentId() { return instrumentId; }
    public void setInstrumentId(String instrumentId) { this.instrumentId = instrumentId; }

    public String getInstrumentName() { return instrumentName; }
    public void setInstrumentName(String instrumentName) { this.instrumentName = instrumentName; }

    public String getCapacity() { return capacity; }
    public void setCapacity(String capacity) { this.capacity = capacity; }

    public String getIssuedToOrg() { return issuedToOrg; }
    public void setIssuedToOrg(String issuedToOrg) { this.issuedToOrg = issuedToOrg; }

    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }

    public String getIssuedByOfficer() { return issuedByOfficer; }
    public void setIssuedByOfficer(String issuedByOfficer) { this.issuedByOfficer = issuedByOfficer; }

    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

    public LocalDate getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDate validUntil) { this.validUntil = validUntil; }

    public String getQrPayload() { return qrPayload; }
    public void setQrPayload(String qrPayload) { this.qrPayload = qrPayload; }

    public Boolean getIsValid() { return isValid; }
    public void setIsValid(Boolean isValid) { this.isValid = isValid; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
