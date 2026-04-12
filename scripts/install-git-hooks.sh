#!/usr/bin/env bash
set -euo pipefail

HOOKS_DIR=".git/hooks"
if [ ! -d "$HOOKS_DIR" ]; then
  echo "No .git/hooks directory found. Are you in a git repository?"
  exit 1
fi

cat > "$HOOKS_DIR/post-commit" <<'HOOK'
#!/usr/bin/env bash
# Auto-push after commit: push current branch to origin
branch=$(git rev-parse --abbrev-ref HEAD)
if git remote get-url origin >/dev/null 2>&1; then
  echo "Auto-pushing branch $branch to origin..."
  git push origin "$branch"
else
  echo "No origin remote configured; skipping auto-push."
fi
HOOK

chmod +x "$HOOKS_DIR/post-commit"
echo "Installed post-commit hook to $HOOKS_DIR/post-commit"
