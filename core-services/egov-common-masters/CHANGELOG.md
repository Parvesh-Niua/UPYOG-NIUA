# Changelog - egov-common-masters

---

## [2.0.0] - 2024-06-30

### Java & Spring Boot Upgrade

| Before | After | |
|-----------|-------|----|
| Java | 1.8 | 17 |
| Spring Boot | 1.5.22.RELEASE | 3.2.2 |

---

### Dependencies Update

| Dependency | Before | Now |
|------------|-------|----|
| spring-boot-starter-web | 1.5.22 (managed) | 3.2.2 |
| spring-boot-starter-jdbc | 1.5.22 (managed) | 3.2.2 |
| spring-boot-devtools | 1.5.22 (managed) | 3.2.2 |
| spring-boot-starter-test | 1.5.22 (managed) | 3.2.2 |
| spring-kafka | - | 3.1.1 |
| postgresql | managed | 42.7.1 |
| flyway-core | managed | 9.22.3 |
| lombok | 1.18.22 | 1.18.32 |
| commons-lang3 | 3.0 | 3.14.0 |
| hibernate-validator | - | 8.0.1.Final |
| mdms-client | 0.0.3-SNAPSHOT | 2.9.0-SNAPSHOT |
| tracer | 1.1.5-SNAPSHOT | 2.9.0-SNAPSHOT |

---

### Code Changes

#### 1. `javax` → `jakarta`
Spring Boot 3.x mein `javax` package ka naam `jakarta` ho gaya.

```java
// Pehle
import javax.validation.Valid;
import javax.annotation.PostConstruct;

// Ab
import jakarta.validation.Valid;
import jakarta.annotation.PostConstruct;
```

#### 2. `ResponseInfoFact.java` & `ResponseInfoFactory.java` — `ts` field type change
`tracer 2.9.0` mein `ResponseInfo` ka `ts` field `String` se `Long` ho gaya.

```java
// Pehle (tracer 1.x)
String ts = isEmpty(requestInfo.getTs()) ? null : requestInfo.getTs().toString();

// Ab (tracer 2.9.0)
Long ts = requestInfo.getTs();
```

**Kyun?** `services-common 2.9.0` mein `ResponseInfo` constructor change hua:
```java
// Old: ResponseInfo(String, String, String, String, String, String)
// New: ResponseInfo(String, String, Long, String, String, String)
```

#### 3. Test files — JUnit 4 → JUnit 5
Spring Boot 3.x mein JUnit 4 support nahi hai.

```java
// Pehle (JUnit 4)
import org.junit.Test;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.mockito.Matchers;
import org.junit.Assert;

// Ab (JUnit 5)
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.mockito.ArgumentMatchers;
import org.junit.jupiter.api.Assertions;
```

---

### Removed

| Kya hataya | Kyun |
|------------|------|
| `commons-lang:2.6` | Deprecated, `commons-lang3` use karo |
| `services-common:0.12.0` | Old dependency, `tracer` aur `mdms-client` se replace |
| `logback-classic:1.2.0` | Spring Boot 3.x khud manage karta hai |
| `flyway-database-postgresql` | Flyway 9.x mein exist nahi karta, sirf 10.x mein hai |
| Duplicate `commons-io` entries | Cleanup |

---

## [1.3.5] - 2023-02-01

- Version 1.3.5-beta se 1.3.5 stable mein transition
