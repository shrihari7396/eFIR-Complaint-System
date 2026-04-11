package com.efir.main.service;

import com.efir.main.model.Person;

import java.util.List;

public interface FetchPersonsAssociated {
    List<Person> victims(int firid);

    List<Person> Accused(int firid);

    List<Person> Witnesses(int firid);
}
