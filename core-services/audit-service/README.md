# Audit Service

Audit Service provides a one-stop framework for signing data i.e. creating an immutable data entry to track activities of an entity. Whenever an entity is created/updated/deleted the operation is captured in the data logs and is digitally signed to protect it from tampering.

### Technology Stack
- **Java**: 17
- **Spring Boot**: 3.2.2
- **Database**: PostgreSQL 42.7.1
- **Flyway**: 9.22.3 (Database migration)

### Service Dependencies
- egov-persister
- mdms-client `2.9.0-SNAPSHOT`
- tracer `2.9.0-SNAPSHOT`

### API Details

`BasePath` /audit-service/log/v1/[API endpoint]

##### Method
a) `_create`

This method is used to create an AuditLog.

b) `_search`

This method is used to search audit logs.

### Kafka Consumers

- process-audit-records

### Kafka Producers

- Following are the Producer topic.
    - **audit-create** :- This topic is used to save audit logs.

### How to Run

```bash
mvn clean install -DskipTests
mvn spring-boot:run
```

### Migration Notes
- Migrated from Java 8 to Java 17
- Migrated from Spring Boot 2.2.6 to 3.2.2
- All `javax.*` annotations migrated to `jakarta.*`

### Changelog
Refer to [CHANGELOG.md](CHANGELOG.md) for detailed version history.
