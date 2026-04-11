package com.efir.main.controller;

import com.efir.main.config.GroqApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
public class GroqApiController {
    @Autowired
    private GroqApiService groqApiService;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.model}")
    private String model;

    @PostMapping("/api/groq")
    public String callApi(@RequestBody String content) {
        return groqApiService.callGroqApi(apiKey, model, content);
    }
}
