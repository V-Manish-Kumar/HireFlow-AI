# Multi-stage Dockerfile for HireFlow AI Spring Boot Backend

# Stage 1: Build application with Maven
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper / POM and source code
COPY pom.xml .
COPY src ./src

# Build package skipping tests (tests verified during CI)
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

# Stage 2: Minimal JRE runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S hireflow && adduser -S hireflow -G hireflow && \
    mkdir -p /app/uploads/resumes && chown -R hireflow:hireflow /app

USER hireflow

# Copy built JAR from builder stage
COPY --from=builder /app/target/hireflow-ai-*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
