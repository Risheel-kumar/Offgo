package com.offgo.backend.security.jwt;

import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(secret.getBytes());

    }

    public String generateToken(String email) {

            Date now = new Date();

            Date expiry = new Date(now.getTime() + expiration);

            return Jwts.builder()
                    .subject(email)
                    .issuedAt(now)
                    .expiration(expiry)
                    .signWith(getSigningKey())
                    .compact();

        }
        public String extractUsername(String token) {

            return extractClaim(token, Claims::getSubject);

        }

        public <T> T extractClaim(
                String token,
                Function<Claims, T> claimsResolver) {

            Claims claims = extractAllClaims(token);

            return claimsResolver.apply(claims);

        }

        private Claims extractAllClaims(String token) {

            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

        }

        public boolean isTokenExpired(String token) {
            return extractClaim(
                    token,
                    Claims::getExpiration)
                    .before(new Date());
        }

        public boolean isTokenValid(
                String token,
                String email) {

            String username = extractUsername(token);

            return username.equals(email)
                    && !isTokenExpired(token);
        }

}