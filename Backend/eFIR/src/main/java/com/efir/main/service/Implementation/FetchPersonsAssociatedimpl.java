package com.efir.main.service.Implementation;

import com.efir.main.Repository.PersonRepository;
import com.efir.main.model.Person;
import com.efir.main.service.FetchPersonsAssociated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FetchPersonsAssociatedimpl implements FetchPersonsAssociated {
    @Autowired
    PersonRepository repo;

    @Override
    public List<Person> victims(int firid) {
        List<Person> victims = repo.findVictimsByComplaintId(firid);
        return victims;
    }

    @Override
    public List<Person> Accused(int firid) {
        List<Person> accused = repo.findAccusedByComplaintId(firid);
        return accused1;

    }

    @Override
    public List<Person> Witnesses(int firid) {
        List<Person> witnesses = repo.findWitnessesByComplaintId(firid);
        return witnesses;
    }

    public List<Person> savePersons(List<Person> persons) {
        return repo.saveAll(persons); // Use saveAll instead of saveallperson
    }
}
