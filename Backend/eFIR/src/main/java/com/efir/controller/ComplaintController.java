// com.efir.controller.ComplaintController
package com.efir.controller;

import com.efir.dto.request.ComplaintRequest;
import com.efir.dto.response.ComplaintResponse;
import com.efir.service.complaint.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/complaint")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    // ========================= 7. POST /complaint/save =========================

    @PostMapping("/save")
    public ResponseEntity<ComplaintResponse> saveComplaint(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ComplaintRequest request) {

        ComplaintResponse response = complaintService.fileComplaint(
                userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    // ========================= 8. GET /complaint/fetch =========================

    @GetMapping("/fetch")
    public ResponseEntity<List<ComplaintResponse>> fetchComplaints(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<ComplaintResponse> complaints = complaintService.getComplaintsByUser(
                userDetails.getUsername());
        return ResponseEntity.ok(complaints);
    }
}
