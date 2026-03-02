# Stage 1: Build Stage (Biên dịch mã nguồn)
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy các file cấu hình Maven trước để cache layer (tăng tốc build lần sau)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
# Tải các thư viện cần thiết trước
RUN ./mvnw dependency:go-offline -B

# Copy toàn bộ code và đóng gói file JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Run Stage (Môi trường chạy ứng dụng siêu nhẹ)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Bảo mật: Tạo user 'spring' để không chạy app bằng quyền root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy file JAR đã build từ stage trước
COPY --from=build /app/target/*.jar app.jar

# Render sẽ cấp phát cổng qua biến môi trường $PORT (mặc định thường là 10000)
ENV PORT 8080
EXPOSE 8080

# Cấu hình JVM tối ưu cho môi trường Container và nhận diện đúng Port của Render
ENTRYPOINT ["java", \
            "-XX:+UseContainerSupport", \
            "-XX:MaxRAMPercentage=75.0", \
            "-Dserver.port=${PORT}", \
            "-jar", "app.jar"]