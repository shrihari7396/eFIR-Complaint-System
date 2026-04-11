package com.efir.main.controller;

import com.efir.main.model.Person;
import com.efir.main.service.Implementation.FetchPersonsAssociatedimpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/person")

@CrossOrigin
public class PersonRegister {

    @Autowired
    FetchPersonsAssociatedimpl fetch;

    @PostMapping("/register")
    public String RegisterPerson(@RequestBody List<Person> persons) {
        System.out.println(persons);
        fetch.savePersons(persons); // Save all persons
        return "Persons data saved successfully";
    }
}
