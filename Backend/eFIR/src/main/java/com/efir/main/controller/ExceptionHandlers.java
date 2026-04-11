package com.efir.main.controller;


import com.efir.main.exeptions.ComplaintNotFoundException;
import com.efir.main.exeptions.NoComplaintsFoundExceptions;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandlers {

    @ExceptionHandler(ComplaintNotFoundException.class)
    public ResponseEntity<String> complaintNotFound(ComplaintNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(NoComplaintsFoundExceptions.class)
    public ResponseEntity<String> noComplaintsFound(NoComplaintsFoundExceptions e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
}
