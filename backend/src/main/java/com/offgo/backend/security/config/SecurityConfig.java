package com.offgo.backend.security.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.offgo.backend.security.jwt.JwtAuthenticationFilter;
import com.offgo.backend.security.user.CustomUserDetailsService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

        @Value("${CORS_ALLOWED_ORIGINS:http://localhost:3000}")
        private String corsAllowedOrigins;

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
        public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of(corsAllowedOrigins.split("\\s*,\\s*")));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "Link", "X-Total-Count"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
        }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http

                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                         .requestMatchers(
                                "/api/v1/auth/**",
                                "/api/v1/users/**",
                                "/api/v1/drivers/**",
                                "/api/v1/shuttles/**",
                                "/api/v1/stops/**",
                                "/api/v1/routes/**",
                                "/api/v1/schedules/**",
                                "/api/v1/employees/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api/v1/route-stops/**",
                                "/v3/api-docs/**",
                                "/api-docs/**",
                                "/api/v1/qr/**",
                                "/api/v1/eta/**",
                                "/ws",
                                "/ws/**",
                                "/api/v1/tracking/**",
                                "/api/v1/attendance/**",
                                "/api/v1/bookings/**",
                                "/api/v1/dashboard/**",
                                "/api/v1/notifications/**",
                                "/api/v1/complaints/**",
                                "/api/v1/admin/**",
                                "/error"
                        )
                        .permitAll()

                        .anyRequest()
                        .authenticated())

                .authenticationProvider(authenticationProvider())

                    .addFilterBefore(
                            jwtAuthenticationFilter,
                            UsernamePasswordAuthenticationFilter.class);

            return http.build();
    }

}