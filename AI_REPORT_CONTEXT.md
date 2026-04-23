# eFIR-Complaint-System: Project Context for AI Report Generation

This document provides a comprehensive overview of the eFIR-Complaint-System, designed to serve as context for an AI tasked with generating a complete project report.

## Project Summary
**Project Name:** eFIR — Electronic First Information Report System
**Objective:** A full-stack civic legal platform that digitizes the First Information Report (FIR) process. It enables citizens to file complaints digitally and securely, and allows police officers to review, accept, or reject them via a dedicated dashboard.
**Core Mission:** Enhance transparency, privacy, and efficiency in the legal complaint registration system.

## Key Features
1. **Citizen Portal:**
   - Registration with AES-256-ECB encryption for all Personally Identifiable Information (PII), such as Aadhaar, name, and address.
   - Email-based OTP verification for account activation.
   - JWT-based authentication (24h expiry).
   - FIR filing system capturing details of the victim, accused, and the incident.
   - AI Legal Assistant integration (powered by Groq / LLaMA 3) to guide citizens on legal procedures.
2. **Police Portal:**
   - Role-based secure access for officers.
   - Paginated dashboard to manage incoming complaints with sorting.
   - One-click verdict updates (Accept, Reject, In Progress).
3. **Security:**
   - Client-side encryption for sensitive fields before transmission to the backend, ensuring data remains encrypted in the database.
   - BCrypt hashing for passwords.
   - Strict Role-Based Access Control (RBAC) on both the React frontend and Spring Boot backend.

## Technology Stack
- **Frontend:** React 19, Vite 6, TailwindCSS 3.4, React Router v7, Formik + Yup, Axios, CryptoJS.
- **Backend:** Java 17+, Spring Boot 3.4.2, Spring Security 6.x, Spring Data JPA, MySQL 8, MapStruct, Lombok, Springdoc OpenAPI, WebFlux (for AI API).
- **External Integrations:** Gmail SMTP (OTP delivery), Groq API (AI Legal Assistant).
- **Deployment & Infra:** Docker, Docker Compose, Nginx.

## Architecture
- **Frontend Layer:** Built as a Single Page Application (SPA), it interfaces with the backend via REST APIs. Uses CryptoJS for client-side encryption of PII.
- **Security Layer:** Implements a JWT authentication filter. Passwords are encrypted using BCrypt.
- **Backend Service Layer:** Follows SOLID principles with separate services for Auth, Registration, OTP, Profile, Complaint, Police operations, and AI interaction. Implements the Strategy Pattern for OTP delivery.
- **Data Layer:** Uses MySQL as the primary relational database, mapped through JPA/Hibernate.

## API Specification Overview
- **Authentication:** Contains endpoints for Citizen/Police registration and login, as well as OTP generation/verification.
- **Citizen Operations:** Endpoints to fetch user profiles, file new complaints (`/complaint/save`), and fetch the user's filed complaints (`/complaint/fetch`).
- **Police Operations:** Restricted endpoints for paginated fetching of all complaints (`/api/police/complaints`) and updating verdicts (`/api/police/update`).
- **AI Operations:** `/ai/api/groq` for querying the legal assistant.

## Team Details
- **Backend Development:** Shrihari Kulkarni
- **Frontend Development:** Athrav Katavkar
- **Architecture & Design:** Sanidhya Kulkarni

---
**Instructions for the AI Generating the Final Report:**
1. Please use the details provided above to structure a formal, comprehensive technical report for an academic or professional project submission.
2. Ensure you include sections such as Abstract, Introduction, System Architecture, Technologies Used, Security Mechanisms, Key Features, API Design Summary, and Conclusion.
3. Emphasize the security aspect (AES-256 client-side encryption of PII) and the AI integration (LLaMA 3 legal assistant) as key standout features of this system.
