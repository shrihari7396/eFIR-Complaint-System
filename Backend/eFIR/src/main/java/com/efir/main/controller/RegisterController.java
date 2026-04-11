package com.efir.main.controller;

import com.efir.main.model.Complaint;
import com.efir.main.service.Implementation.FetchComplainServiceImplementation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register")
@CrossOrigin
public class RegisterController {
    @Autowired
    private FetchComplainServiceImplementation registerer;

    @PostMapping("/complaint")
    public ResponseEntity<?> registerComplaint(@RequestBody Complaint complaint) {
        try {
            System.out.println("Received Complaint: " + complaint);
            System.out.println("Filed By: " + complaint.getFiledBy()); // Debugging

            if (complaint.getFiledBy() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("FiledBy (User) is missing in the request");
            }

            Complaint registered = registerer.saveComplaint(complaint);
            return ResponseEntity.ok().body(registered);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        }
    }
}