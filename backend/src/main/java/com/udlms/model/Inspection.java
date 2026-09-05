package com.udlms.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inspections")
public class Inspection {

    @Id
    @Column(length = 50)
    private String id; // e.g. T-8842

    @Column(name = "instrument_id", length = 50, nullable = false)
    private String instrumentId;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(name = "location_display", nullable = false)
    private String locationDisplay;

    @Column(name = "distance_km")
    private String distanceKm;

    @Column(nullable = false)
    private String status; // 'Pending', 'Overdue', 'Completed'

    @Column(name = "captured_serial")
    private String capturedSerial;

    @Column(name = "result")
    private String result; // 'Pass (Verified)', 'Fail (Needs Repair)', 'Confiscated'

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate = LocalDate.now();

    public Inspection() {}

    public Inspection(String id, String instrumentId, String businessName, String locationDisplay, String distanceKm, String status) {
        this.id = id;
        this.instrumentId = instrumentId;
        this.businessName = businessName;
        this.locationDisplay = locationDisplay;
        this.distanceKm = distanceKm;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getInstrumentId() { return instrumentId; }
    public void setInstrumentId(String instrumentId) { this.instrumentId = instrumentId; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getLocationDisplay() { return locationDisplay; }
    public void setLocationDisplay(String locationDisplay) { this.locationDisplay = locationDisplay; }

    public String getDistanceKm() { return distanceKm; }
    public void setDistanceKm(String distanceKm) { this.distanceKm = distanceKm; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCapturedSerial() { return capturedSerial; }
    public void setCapturedSerial(String capturedSerial) { this.capturedSerial = capturedSerial; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
}
