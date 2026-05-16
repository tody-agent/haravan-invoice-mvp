#!/bin/bash
# Smoke test — verify all endpoints respond correctly

API_URL="http://localhost:8787/api/v1"

echo "=== E2E Smoke Tests ==="

# Login
echo "🔐 Logging in..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"test"}' | jq -r '.data.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed"
  exit 1
fi
echo "✅ Login successful"

# Health
echo "💚 Checking health..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
[ "$STATUS" = "200" ] && echo "✅ Health OK" || echo "❌ Health failed ($STATUS)"

# Invoices list
echo "📋 Checking invoices..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/invoices" \
  -H "Authorization: Bearer $TOKEN")
[ "$STATUS" = "200" ] && echo "✅ Invoices OK" || echo "❌ Invoices failed ($STATUS)"

# Products
echo "📦 Checking products..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/products" \
  -H "Authorization: Bearer $TOKEN")
[ "$STATUS" = "200" ] && echo "✅ Products OK" || echo "❌ Products failed ($STATUS)"

# Notifications
echo "🔔 Checking notifications..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/notifications" \
  -H "Authorization: Bearer $TOKEN")
[ "$STATUS" = "200" ] && echo "✅ Notifications OK" || echo "❌ Notifications failed ($STATUS)"

# Analytics
echo "📊 Checking analytics..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/analytics/channels" \
  -H "Authorization: Bearer $TOKEN")
[ "$STATUS" = "200" ] && echo "✅ Analytics OK" || echo "❌ Analytics failed ($STATUS)"

# Reports
echo "📈 Checking reports..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/reports/summary" \
  -H "Authorization: Bearer $TOKEN")
[ "$STATUS" = "200" ] && echo "✅ Reports OK" || echo "❌ Reports failed ($STATUS)"

# Settings
echo "⚙️ Checking settings..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/settings" \
  -H "Authorization: Bearer $TOKEN")
[ "$STATUS" = "200" ] && echo "✅ Settings OK" || echo "❌ Settings failed ($STATUS)"

# Customers
echo "👥 Checking customers..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/customers" \
  -H "Authorization: Bearer $TOKEN")
[ "$STATUS" = "200" ] && echo "✅ Customers OK" || echo "❌ Customers failed ($STATUS)"

# MST lookup
echo "🔍 Checking MST lookup..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/mst/validate?mst=0123456789" \
  -H "Authorization: Bearer $TOKEN")
[ "$STATUS" = "200" ] && echo "✅ MST lookup OK" || echo "❌ MST lookup failed ($STATUS)"

# Aggregate
echo "📅 Checking aggregate..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/aggregate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}')
[ "$STATUS" = "200" ] || [ "$STATUS" = "400" ] && echo "✅ Aggregate OK" || echo "❌ Aggregate failed ($STATUS)"

echo ""
echo "=== E2E Smoke Tests Complete ==="
