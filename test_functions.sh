#!/bin/bash

# Test AI Chat Function
echo "=== Testing AI Chat Function ==="
curl -X POST https://foxjxumqlcyzfxcbayro.supabase.co/functions/v1/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What treks do you offer?"}
    ]
  }' 2>/dev/null | head -c 500

echo -e "\n\n=== Testing Send Notification Function ==="
curl -X POST https://foxjxumqlcyzfxcbayro.supabase.co/functions/v1/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "type": "admin_login",
    "data": {"email": "test@example.com"}
  }' 2>/dev/null

echo -e "\n\nTest complete"
