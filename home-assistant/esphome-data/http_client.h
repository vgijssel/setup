#pragma once

#include "esphome/core/component.h"
#include "esp_http_client.h"
#include "ArduinoJson.h"

bool do_request(float rssi_value, std::string room_name, std::string family_name) {
    char local_response_buffer[2048] = {0};

    esp_http_client_config_t config = {
        .host = "192.168.1.30",
        .port = 8003,
        .path = "/passive",
        .method = HTTP_METHOD_POST,
        .user_data = local_response_buffer,        // Pass address of local buffer to get response
    };
    esp_http_client_handle_t client = esp_http_client_init(&config);

    std::string result;
    DynamicJsonDocument doc(1024);
    doc["d"] = room_name;
    doc["l"] = room_name;
    doc["f"] = family_name;
    JsonObject sensorData = doc.createNestedObject("s");
    JsonObject bluetoothData = sensorData.createNestedObject("bluetooth");
    bluetoothData["00:00:00:00:00:00"] = rssi_value;
    serializeJson(doc, result);

    ESP_LOGI("http", "JSON: %s", result.c_str());

    const char *post_data = result.c_str();

    esp_http_client_set_url(client, "http://192.168.1.30:8003/passive");
    esp_http_client_set_method(client, HTTP_METHOD_POST);
    esp_http_client_set_header(client, "Content-Type", "application/json");
    esp_http_client_set_post_field(client, post_data, strlen(post_data));
    esp_err_t err = esp_http_client_perform(client);

    if (err == ESP_OK) {
        ESP_LOGI("http", "HTTP POST Status = %d", esp_http_client_get_status_code(client));
        esp_http_client_cleanup(client);
        return true;
    } else {
        ESP_LOGE("http", "HTTP POST request failed: %s", esp_err_to_name(err));
        esp_http_client_cleanup(client);
        return false;
    }
}