package com.udlms.controller;

import com.udlms.model.Inspection;
import com.udlms.model.Instrument;
import com.udlms.repository.InspectionRepository;
import com.udlms.repository.InstrumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/instruments")
public class InstrumentController {

    @Autowired
    private InstrumentRepository instrumentRepository;

    @Autowired
    private InspectionRepository inspectionRepository;

    @GetMapping
    public List<Instrument> getAllInstruments() {
        return instrumentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Instrument> registerInstrument(@RequestBody Instrument instrument) {
        if (instrument.getId() == null || instrument.getId().isEmpty()) {
            String prefix = instrument.getName().toLowerCase().contains("fuel") ? "FD" :
                            instrument.getName().toLowerCase().contains("platform") ? "PS" : "WS";
            instrument.setId(prefix + "-" + (100000 + new Random().nextInt(900000)));
        }

        if (instrument.getStatus() == null) {
            instrument.setStatus("Pending");
        }

        if (instrument.getDistrict() == null) {
            instrument.setDistrict("Central District");
        }

        Instrument saved = instrumentRepository.save(instrument);

        // Automatically create field inspection task
        String taskId = "T-" + (1000 + new Random().nextInt(9000));
        Inspection task = new Inspection(
                taskId,
                saved.getId(),
                saved.getOwnerName() != null ? saved.getOwnerName() : "Acme Corp",
                saved.getLocationAddress(),
                String.format("%.1f km", 1.0 + new Random().nextDouble() * 5.0),
                "Pending"
        );
        inspectionRepository.save(task);

        return ResponseEntity.ok(saved);
    }
}
