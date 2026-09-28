/**
 * Préparation de l'environnement de test.
 *
 * Les variables lues par la configuration sont figées ici : sans cela, un
 * `.env` présent sur la machine de développement rendrait les tests
 * dépendants de la configuration locale, et un test pourrait passer chez le
 * développeur puis échouer en CI.
 */
process.env.EXPO_PUBLIC_WEB_URL = 'https://suprem-ia.netlify.app';
process.env.EXPO_PUBLIC_MQTT_URL = 'wss://broker.test:8884/mqtt';
process.env.EXPO_PUBLIC_MQTT_USER = 'utilisateur-test';
process.env.EXPO_PUBLIC_MQTT_PASSWORD = 'motdepasse-test';
process.env.EXPO_PUBLIC_MQTT_TOPIC = 'supremia/#';
process.env.EXPO_PUBLIC_MQTT_SIMULATE = 'false';
