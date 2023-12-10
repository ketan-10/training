#FROM openjdk:21
#COPY target/*.jar app.jar
#ENTRYPOINT ["java","-jar","/app.jar"]

FROM maven:3.9.5-sapmachine-21 
COPY . .
RUN mvn clean package  
RUN cp target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
EXPOSE 8080
