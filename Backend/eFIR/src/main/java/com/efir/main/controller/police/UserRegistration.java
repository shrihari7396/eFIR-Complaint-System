package com.efir.main.controller.police;

import com.efir.main.model.User;
import com.efir.main.service.Implementation.FetchComplainServiceImplementation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserRegistration {
    @Autowired
    private FetchComplainServiceImplementation registerer;

    @PostMapping("/register")
    public ResponseEntity<?> registerComplaint(@RequestBody User user) {
        try {

            User registered = registerer.saveuser(user);
            return ResponseEntity.ok().body(registered);
        } catch (Exception e) {
            System.out.println("Problem in saving the complant");
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        }

    }
}
