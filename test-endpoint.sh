#!/bin/bash

# Test appointment details endpoint
# Replace these values with actual IDs from your database

DOCTOR_ID=1
APPOINTMENT_ID=1
TOKEN="your_token_here"

curl -X GET "http://localhost:4000/api/doctors/$DOCTOR_ID/appointments/$APPOINTMENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -v
