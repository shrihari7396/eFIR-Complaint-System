package com.efir.main.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;

    // Generate a secure key from the secret string
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email) {
        // Add custom claims to the token
        return Jwts.builder()
                .setSubject(email) // Set the subject (e.g., user email)
                .setIssuedAt(new Date()) // Set the issued date
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000L)) // Set expiration time
                .claim("customClaim", "customValue") // Add a custom claim
                .signWith(getSigningKey(), SignatureAlgorithm.HS512) // Sign the token
                .compact(); // Compact the token into a string
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret) // Set the signing key directly
                .parseClaimsJws(token) // Parse and validate the token
                .getBody(); // Extract the claims
    }
}