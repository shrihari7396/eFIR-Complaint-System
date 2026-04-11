package com.efir.main.controller.citizen;

import com.efir.main.exeptions.ComplaintNotFoundException;
import com.efir.main.model.Complaint;
import com.efir.main.service.Implementation.FetchComplainServiceImplementation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/citizen")
public class FectchComplaintCitizen {
    @Autowired
    private FetchComplainServiceImplementation fetch;

    @GetMapping("/fetch/{id}")
    public ResponseEntity<Complaint> getComplaint(@PathVariable String id) throws ComplaintNotFoundException {
        Complaint complaint = fetch.fetchByFirId(id);
        return ResponseEntity.ok(complaint);
    }

}
