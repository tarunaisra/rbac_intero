# Postman
```dart
[RBAC.postman_collection.json](https://github.com/user-attachments/files/23813980/RBAC.postman_collection.json)
{
	"info": {
		"_postman_id": "8ae8b1b8-7d60-43fe-ab70-c7f19d4e335b",
		"name": "RBAC",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "48128944",
		"_collection_link": "https://tarunaisra05-5516957.postman.co/workspace/taruna-isra's-Workspace~e6ce09e1-b62d-4125-844b-15b1579fb997/collection/48128944-8ae8b1b8-7d60-43fe-ab70-c7f19d4e335b?action=share&source=collection_link&creator=48128944"
	},
	"item": [
		{
			"name": "New Request",
			"request": {
				"method": "GET",
				"header": []
			},
			"response": []
		},
		{
			"name": "New Request",
			"request": {
				"method": "GET",
				"header": []
			},
			"response": []
		},
		{
			"name": "New Request",
			"protocolProfileBehavior": {
				"disableBodyPruning": true
			},
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": [
						{
							"key": "token",
							"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJ1c2VybmFtZSI6InRhcnVuYWlzcmFfIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNzY0MjI3MzI3LCJleHAiOjE3NjQyMzA5Mjd9.HKpZhyRdw1vphGClORj8-lkKVfGe_BYwSwaK6pLRErQ",
							"type": "string"
						}
					]
				},
				"method": "GET",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n  \"name\": \"Jada Monica\",\r\n  \"nasionality\": \"Kongo\",\r\n  \"birthYear\": \"1922\"\r\n}\r\n\r\n",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3300/directors",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3300",
					"path": [
						"directors"
					]
				}
			},
			"response": []
		}
	]
}
```
