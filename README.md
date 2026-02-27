. <img width="1443" height="826" alt="image" src="https://github.com/user-attachments/assets/5f6b125c-8742-4fe9-a038-7dc7219b9977" />


<img width="1808" height="848" alt="Screenshot 2026-01-15 155210" src="https://github.com/user-attachments/assets/e187a7bb-7b44-4649-85d0-885979f3bc76" />
<img width="1813" height="847" alt="Screenshot 2026-01-15 154855" src="https://github.com/user-attachments/assets/c1fab379-ec1e-4fe1-adc5-78935b63b3b7" />


🍽️ Craveo — Full-Stack Food Ordering Platform

Craveo is a production-grade full-stack food ordering platform built with a modern React + TypeScript frontend and an event-driven, AI-powered backend.
The project focuses on real-world system design, scalability, and clean architecture, not tutorial-level CRUD.

🚀 What is Craveo?

Craveo enables users to:

Discover food using AI-powered search & chat

Place and pay for orders securely

Track orders in real time with smart ETA prediction

Experience a fast, responsive UI backed by a scalable backend

This project is intentionally designed to simulate real startup infrastructure.

🖥️ Frontend Overview

The frontend is a type-safe, component-driven React application built with TypeScript and Tailwind CSS, optimized for performance, clarity, and maintainability.

✨ Frontend Features

⚛️ React + TypeScript

Fully typed components and API interactions

Predictable state management using hooks

Clean separation of concerns

🎨 Tailwind CSS

Utility-first, responsive UI

Mobile-first layouts

Consistent design system

Zero custom CSS bloat

🧠 AI-Powered UX

Natural language food search

AI chat assistant integrated into UI

Dynamic filters & recommendations

🛒 Ordering & Payments

Cart management with optimistic UI

Razorpay checkout flow

Clear order lifecycle visualization

📦 Real-Time Order Tracking

Live order status updates

ETA display synced with backend

Status-based UI transitions

🔐 Auth-Aware UI

Role-based route protection

Conditional rendering for users/admins/delivery

Secure session handling

🧱 Frontend Tech Stack

React.js

TypeScript

Tailwind CSS

Axios / Fetch

React Router

🧠 Backend Overview

The backend is an event-driven system built with Node.js and TypeScript, designed to handle scale, async workflows, and AI workloads.

🔐 Authentication & Security

JWT access + refresh tokens

Role-based authorization (customer / admin / delivery)

Redis-backed session & rate limiting

Auth activity logging via Redis Streams

🍔 Product & Menu Management

Admin-only product CRUD

Cloudinary image uploads

Redis caching with invalidation

Product embeddings for AI recommendations

🛒 Order Management (State Machine)
PLACED → CONFIRMED → PREPARING → PICKED_UP → DELIVERED
                      ↘ CANCELLED


Ownership validation

Delivery agent assignment

Kafka-powered order events

Redis-based real-time order status

💳 Payments (Razorpay)

Secure payment order creation

Signature verification (HMAC)

Payment → order confirmation flow

Prevents unpaid order confirmation

📧 Email Notifications

Order confirmation emails

Order status updates

HTML + text templates

Non-blocking email delivery

🤖 AI Features (Core Differentiator)
🍱 AI Recommendation Engine

Product embeddings (Ollama / Gemini)

Vector similarity search

Personalized recommendations

Cached results for performance

💬 AI Food Chat Assistant

Natural language intent parsing

Structured filter extraction

Dynamic MongoDB query generation

AI-generated conversational responses

⏱️ Smart ETA Prediction

Predicts delivery time using:

Distance

Time of day

Day of week

Restaurant load

Historical ETA tracking

Accuracy analytics for admins

📡 Event-Driven Architecture
Kafka Topics

order-status

product-updates

ai-recommendations

ai-chat-queries

eta-predictions

Why Kafka?

Loose coupling

Async processing

Scalable analytics

Real-time updates without blocking APIs

📊 Monitoring & Admin Tools

Order metrics by status

Rate-limit violation tracking

Auth activity logs

ETA accuracy reports

Dead Letter Queue (DLQ) handling

🧱 Backend Tech Stack

Node.js + TypeScript

Express.js

MongoDB (Mongoose)

Redis (cache, streams, pub/sub)

Apache Kafka

Razorpay

Cloudinary

Nodemailer

Ollama / Gemini (GenAI)
