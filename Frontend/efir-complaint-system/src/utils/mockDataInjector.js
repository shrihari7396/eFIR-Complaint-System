import { encryptAES } from "./AESEncryption.js";
import { encryptComplaint } from "../context/DecryptionHelper.js";

const rawComplaint = {
    id: 101,
    victim: {
        firstName: "Jane",
        lastName: "Citizen",
        phone: "9876543210",
        address: { street: "123 Test St", city: "Testville", state: "Test State", zip: "12345", country: "India" }
    },
    accused: {
        firstName: "John",
        lastName: "Doe",
        phone: "0123456789",
        address: { street: "456 Bad St", city: "Crimeville", state: "Test State", zip: "12345", country: "India" }
    },
    incidence: {
        date: "2026-04-16",
        time: "14:30",
        description: "Testing dummy data generation.",
        crimetype: "Theft",
        address: { street: "789 Park Ave", city: "Testville", state: "Test State", zip: "12345", country: "India" }
    },
    evidenceLink: "https://example.com/evidence.png",
    status: "PROCESSING"
};

export function injectCitizenDummyData() {
    const encryptedComplaint = encryptComplaint(rawComplaint);
    
    const header = btoa(JSON.stringify({alg: "HS256", typ: "JWT"}));
    const payload = btoa(JSON.stringify({sub: "test_citizen", role: "USER", exp: Math.floor(Date.now() / 1000) + 3600}));
    const token = `${header}.${payload}.dummy_signature`;
    
    const user = {
        id: 999,
        username: "test_citizen",
        email: "test@example.com",
        firstName: encryptAES("Jane"),
        lastName: encryptAES("Citizen"),
        aadharNumber: encryptAES("123456789012"),
        address: {
            street: encryptAES("123 Test St"), 
            city: encryptAES("Testville"), 
            state: encryptAES("Test State"), 
            zip: encryptAES("12345"), 
            country: encryptAES("India")
        },
        role: "USER",
        verified: true
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("TEST_MODE", "true");
    sessionStorage.setItem("complaints", JSON.stringify([encryptedComplaint]));
}

export function injectPoliceDummyData() {
    const header = btoa(JSON.stringify({alg: "HS256", typ: "JWT"}));
    const payload = btoa(JSON.stringify({sub: "admin_police", role: "POLICE", exp: Math.floor(Date.now() / 1000) + 3600}));
    const token = `${header}.${payload}.dummy_signature`;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({
        id: 1, 
        username: "admin_police", 
        firstName: encryptAES("Inspector"), 
        lastName: encryptAES("Test"), 
        role: "POLICE", 
        verified: true
    }));
    localStorage.setItem("TEST_MODE", "true");
}

export function getMockComplaints() {
    return [encryptComplaint(rawComplaint)];
}
