#include <DHT.h>
#include <ArduinoJson.h>

#define DHTPIN A0
#define DHTTYPE DHT11
#define gasPin A1

DHT dht(DHTPIN, DHTTYPE);
StaticJsonDocument<100> doc;

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  delay(1000); // đọc mỗi 1s

  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float g = analogRead(gasPin);

  doc["temperature"] = t;
  doc["humidity"] = h;
  doc["gas"] = g;

  serializeJson(doc, Serial);
  Serial.println(); 
}
