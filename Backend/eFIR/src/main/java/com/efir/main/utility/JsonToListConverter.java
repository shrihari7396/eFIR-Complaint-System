package com.efir.main.utility;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class JsonToListConverter {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(JsonToListConverter.class);

    public List<String> convertJsonToList(String jsonString) {
        try {
            // Validate JSON string
            if (jsonString == null || jsonString.trim().isEmpty()) {
                logger.warn("Empty or null JSON string provided.");
                return List.of("Not Identified");
            }

            // Attempt to parse JSON
            return objectMapper.readValue(jsonString, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            logger.error("Error parsing JSON: " + e.getMessage(), e);
            return List.of("Not Identified"); // Default value if parsing fails
        } catch (Exception e) {
            logger.error("Unexpected error while parsing JSON: " + e.getMessage(), e);
            return List.of("Not Identified");
        }
    }
}