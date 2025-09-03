#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

const char* ssid = ""; //ur wifi      
const char* password = ""; // ur password

ESP8266WebServer server(80);

StaticJsonDocument<200> doc;
float temperature = 0, humidity = 0, gas = 0;

void handleData() {
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["temperature"] = temperature;
  jsonDoc["humidity"] = humidity;
  jsonDoc["gas"] = gas;

  String jsonResponse;
  serializeJson(jsonDoc, jsonResponse);
  server.send(200, "application/json", jsonResponse);
}

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/data", handleData);
  server.begin();
}

void loop() {
  server.handleClient();

  // Đọc dữ liệu JSON từ Arduino qua UART
  if (Serial.available()) {
    String data = Serial.readStringUntil('\n');
    DeserializationError error = deserializeJson(doc, data);

    if (!error) {
      temperature = doc["temperature"];
      humidity = doc["humidity"];
      gas = doc["gas"];
    }
  }
}
