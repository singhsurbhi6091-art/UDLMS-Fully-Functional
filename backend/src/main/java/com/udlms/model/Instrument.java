package com.udlms.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "instruments")
public class Instrument {

    @Id
    @Column(length = 50)
    private String id; // e.g. WS-458923

    @Column(nullable = false)
    private String name;

    @Column(name = "instrument_type", nullable = false)
    private String instrumentType;

    @Column(nullable = false)
    private String capacity;

    @Column(name = "model_number")
    private String modelNumber;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "location_address", nullable = false)
    private String locationAddress;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String status; // 'Verified', 'Pending', 'Expiring Soon', 'Expired'

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Instrument() {}

    public Instrument(String id, String name, String instrumentType, String capacity, String locationAddress, String district, String status) {
        this.id = id;
        this.name = name;
        this.instrumentType = instrumentType;
        this.capacity = capacity;
        this.locationAddress = locationAddress;
        this.district = district;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getInstrumentType() { return instrumentType; }
    public void setInstrumentType(String instrumentType) { this.instrumentType = instrumentType; }

    public String getCapacity() { return capacity; }
    public void setCapacity(String capacity) { this.capacity = capacity; }

    public String getModelNumber() { return modelNumber; }
    public void setModelNumber(String modelNumber) { this.modelNumber = modelNumber; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
