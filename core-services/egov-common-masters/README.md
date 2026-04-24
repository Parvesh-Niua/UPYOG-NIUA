# egov-common-masters

Yeh service common master data manage karti hai jaise Department, Holiday, Religion, Language, UOM, Business Category, Business Details etc.

---

## Requirements

| Tool | Version |
|------|---------|
| Java | 17 |
| Maven | 3.3.9+ |
| PostgreSQL | 10+ |
| Kafka | 2.x+ |
| Spring Boot | 3.2.2 |

---

## Project Structure

```
egov-common-masters/
├── src/main/java/org/egov/commons/
│   ├── config/          # Application properties
│   ├── consumers/       # Kafka consumers
│   ├── model/           # Domain models
│   ├── repository/      # DB queries (JDBC)
│   ├── service/         # Business logic
│   ├── web/
│   │   ├── contract/    # Request/Response DTOs
│   │   ├── controller/  # REST APIs
│   │   └── errorhandlers/
│   └── EgovCommonMastersApplication.java
├── src/main/resources/
│   ├── db/migration/    # Flyway SQL scripts
│   └── application.properties
└── pom.xml
```

---

## Build Kaise Karein

```bash
# Clone karo
git clone <repo-url>
cd egov-common-masters

# Build karo (tests skip karke)
mvn clean install -DskipTests

# Tests ke saath build
mvn clean install
```

---

## Run Kaise Karein

```bash
mvn spring-boot:run
```

Ya JAR se:
```bash
java -jar target/egov-common-masters-0.0.1-SNAPSHOT.jar
```

---

## Important application.properties

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/egov_common_masters
spring.datasource.username=postgres
spring.datasource.password=postgres

# Kafka
spring.kafka.bootstrap-servers=localhost:9092

# MDMS
egov.mdms.host=http://localhost:8094
egov.mdms.search.endpoint=/egov-mdms-service/v1/_search

# Timezone
app.timezone=Asia/Kolkata
```

---

## APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/departments/v1/_create` | Department create |
| POST | `/departments/v1/_update` | Department update |
| POST | `/departments/v1/_search` | Department search |
| POST | `/businessCategory/_create` | Business category create |
| POST | `/businessCategory/_update` | Business category update |
| POST | `/businessCategory/_search` | Business category search |
| POST | `/businessDetails/_create` | Business details create |
| POST | `/businessDetails/_update` | Business details update |
| POST | `/businessDetails/_search` | Business details search |
| POST | `/holidays/_search` | Holiday search |
| POST | `/religions/_search` | Religion search |
| POST | `/languages/_search` | Language search |

---

## Dependencies (Key)

| Dependency | Version | Kaam |
|------------|---------|------|
| spring-boot-starter-web | 3.2.2 | REST APIs |
| spring-boot-starter-jdbc | 3.2.2 | Database |
| postgresql | 42.7.1 | DB Driver |
| flyway-core | 9.22.3 | DB Migration |
| spring-kafka | 3.1.1 | Kafka |
| lombok | 1.18.32 | Boilerplate reduce |
| commons-lang3 | 3.14.0 | String utilities |
| hibernate-validator | 8.0.1.Final | Validation |
| mdms-client | 2.9.0-SNAPSHOT | MDMS integration |
| tracer | 2.9.0-SNAPSHOT | Logging/Tracing |

---

## Common Errors & Fix

| Error | Cause | Fix |
|-------|-------|-----|
| `invalid flag: --release` | Java 8 active hai system pe | Java 17 set karo: `export JAVA_HOME=$(/usr/libexec/java_home -v 17)` |
| `incompatible types: String cannot be converted to Long` | Old code mein `ts` String tha, new `tracer` mein Long hai | `ResponseInfoFact.java` mein `String ts` ko `Long ts` karo |
| `flyway-database-postgresql not found` | Yeh artifact Flyway 10.x mein hai, 9.x mein nahi | Remove karo, `flyway-core` 9.x mein PostgreSQL built-in hai |
