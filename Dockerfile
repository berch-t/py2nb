FROM node:22-slim AS base

# Install Python + uv + jupytext for notebook conversion
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv curl ca-certificates \
    && curl -LsSf https://astral.sh/uv/install.sh | sh \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.local/bin:$PATH"

# Pre-install jupytext globally using uv
# This ensures jupytext is available without runtime downloads
RUN uv pip install --system jupytext

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for NEXT_PUBLIC_ vars (inlined at build time)
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
ARG NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=$NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
ENV NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=$NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build

# --- Runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Ensure Python3 and jupytext are accessible from nextjs user
# Jupytext was installed system-wide in base stage with `uv pip install --system jupytext`
# Verify installation
RUN python3 -m jupytext --version || echo "Jupytext not found"

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
