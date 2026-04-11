// com.efir.exception.OtpExpiredException
package com.efir.exception;

public class OtpExpiredException extends RuntimeException {
    public OtpExpiredException(String message) {
        super(message);
    }
}
