package com.udlms.controller;

import com.udlms.model.Certificate;
import com.udlms.model.Inspection;
import com.udlms.model.Instrument;
import com.udlms.repository.CertificateRepository;
import com.udlms.repository.InspectionRepository;
import com.udlms.repository.InstrumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/inspections")
public class InspectionController {

    @Autowired
    private InspectionRepository inspectionRepository;

    @Autowired
    private InstrumentRepository instrumentRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @GetMapping
    public List<Inspection> getAllInspections() {
        return inspectionRepository.findAll();
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<?> recordVerification(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {

        Optional<Inspection> optTask = inspectionRepository.findById(id);
        if (optTask.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Inspection task = optTask.get();
        String result = payload.getOrDefault("result", "Pass (Verified)");
        String remarks = payload.getOrDefault("remarks", "Verified conforming to Legal Metrology General Rules, 2011");
        String capturedSerial = payload.get("capturedSerial");

        task.setStatus("Completed");
        task.setResult(result);
        task.setRemarks(remarks);
        task.setCapturedSerial(capturedSerial);
        task.setCompletedAt(LocalDateTime.now());
        inspectionRepository.save(task);

        // Update instrument
        Optional<Instrument> optInst = instrumentRepository.findById(task.getInstrumentId());
        String certId = null;

        if (optInst.isPresent()) {
            Instrument inst = optInst.get();
            if ("Pass (Verified)".equalsIgnoreCase(result)) {
                inst.setStatus("Verified");
                inst.setExpiryDate(LocalDate.now().plusYears(1));
                if (capturedSerial != null && !capturedSerial.isEmpty()) {
                    inst.setSerialNumber(capturedSerial);
                }
                instrumentRepository.save(inst);

                // Generate Official Digital Certificate
                String certNum = String.valueOf(1000 + new Random().nextInt(9000));
                certId = "CERT-2026-" + certNum;

                Certificate cert = new Certificate(
                        certId,
                        "DLM/CD/2026/" + certNum,
                        inst.getId(),
                        inst.getName(),
                        inst.getCapacity(),
                        task.getBusinessName(),
                        task.getLocationDisplay(),
                        "Inspector V. K. Verma (Badge #LM-402)",
                        LocalDate.now().plusYears(1)
                );
                cert.setQrPayload("https://234-maker.github.io/UDLMS/certificate/" + certId);
                certificateRepository.save(cert);
            } else if ("Fail (Needs Repair)".equalsIgnoreCase(result)) {
                inst.setStatus("Expired");
                instrumentRepository.save(inst);
            } else if ("Confiscated".equalsIgnoreCase(result)) {
                inst.setStatus("Rejected");
                instrumentRepository.save(inst);
            }
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "taskId", id,
                "status", "Completed",
                "result", result,
                "certId", certId != null ? certId : ""
        ));
    }
}
