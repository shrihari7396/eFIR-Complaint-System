package com.efir.main.controller.police;


import com.efir.main.model.Complaint;
import com.efir.main.model.Person;
import com.efir.main.service.Implementation.FetchComplainServiceImplementation;
import com.efir.main.service.Implementation.FetchPersonsAssociatedimpl;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@RequestMapping("/authority")
public class FetchComplaintAuthority {
    @Autowired
    private FetchComplainServiceImplementation fetch;
    @Autowired
    private FetchPersonsAssociatedimpl fetchperson;

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        List<Complaint> complaints = fetch.fetchAll();
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/persons/{firid}")
    public ResponseEntity<List<List<Person>>> getpersonsassociated(@PathVariable int firid) {
        List<Person> accused = fetchperson.Accused(firid);
        List<Person> witness = fetchperson.Witnesses(firid);
        List<Person> victims = fetchperson.victims(firid);
        List<List<Person>> allperson = List.of(accused, witness, victims);
        return ResponseEntity.ok().body(allperson);
        //alwways sends 3 lsit if not persent then empty list will be sent
    }
}
