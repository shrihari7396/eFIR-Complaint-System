// com.efir.exception.UserAlreadyExistsException
package com.efir.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
