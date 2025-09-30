# Local Build Commands

## Quick Reference

### Replicate GitHub Actions Build Locally
```bash
# Clean build process (same as CI)
./scripts/build-local.sh

# Complete CI pipeline with all checks
./scripts/ci-local.sh
```

### Test Built Application
```bash
# Serve the built static files
npx serve out -p 3000

# Alternative with Python
cd out && python -m http.server 3000
```

### Development vs Production Comparison
```bash
# Development build (with hot reload)
npm run dev

# Production build (same as GitHub Actions)
./scripts/build-local.sh
```

### Debug Build Issues
```bash
# 1. Run complete CI pipeline locally
./scripts/ci-local.sh

# 2. Check build output
ls -la out/

# 3. Compare with GitHub Actions logs
# - Same package manager detection
# - Same npm ci command
# - Same next build process
```

## Key Differences from Development

| Development (`npm run dev`) | Production (`./scripts/build-local.sh`) |
|---|---|
| Uses Turbopack | Uses standard webpack |
| Hot module reload | Static file generation |
| Source maps enabled | Optimized bundle |
| Fast refresh | No runtime dependencies |
| Port 9002 | Static files in `out/` |

## Troubleshooting

If GitHub Actions fails but local works:
1. Run `./scripts/ci-local.sh` to replicate full CI
2. Check Node.js version (CI uses Node 20)
3. Ensure clean install with `npm ci` not `npm install`
4. Check for environment-specific dependencies