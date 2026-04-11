// com.efir.controller.PoliceController
package com.efir.controller;

import com.efir.dto.response.PagedComplaintsResponse;
import com.efir.service.police.PoliceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/police")
@RequiredArgsConstructor
public class PoliceController {

    private final PoliceService policeService;

    // ========================= 9. GET /api/police/complaints =========================

    @GetMapping("/complaints")
    public ResponseEntity<PagedComplaintsResponse> getComplaints(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int size) {

        PagedComplaintsResponse response = policeService.getAllComplaints(pageNumber, size);
        return ResponseEntity.ok(response);
    }

    // ========================= 10. POST /api/police/update =========================

    @PostMapping("/update")
    public ResponseEntity<String> updateVerdict(
            @RequestParam String verdict,
            @RequestParam Long id) {

        policeService.updateVerdict(id, verdict);
        return ResponseEntity.ok("Verdict updated successfully");
    }
}
