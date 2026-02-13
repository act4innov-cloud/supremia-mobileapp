
{ pkgs, ... }: {
  channel = "stable-24.11";
  packages = [ pkgs.nodejs_20 pkgs.nodePackages.npm pkgs.jdk17 pkgs.unzip pkgs.git pkgs.firebase-tools pkgs.watchman ];
  env = {
    EXPO_PUBLIC_FIREBASE_API_KEY = "AIzaSyCT92qHemjrtm4XVBiaFKIp_5JLd2TE93o";
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = "supremia-mobileapp.firebaseapp.com";
    EXPO_PUBLIC_FIREBASE_PROJECT_ID = "supremia-mobileapp";
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = "supremia-mobileapp.firebasestorage.app";
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "472617225455";
    EXPO_PUBLIC_FIREBASE_APP_ID = "1:472617225455:web:7697dc1fd5e2e588601f1a";
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID = "G-Z0G59CEMCE";
    EXPO_PUBLIC_MQTT_BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";
    EXPO_PUBLIC_MQTT_USERNAME = "";
    EXPO_PUBLIC_MQTT_PASSWORD = "";
  };
  idx.extensions = [ "dbaeumer.vscode-eslint" "esbenp.prettier-vscode" "dsznajder.es7-react-js-snippets" ];
  idx.workspace.onCreate = {
    npm-install = "npm install";
    install-expo = "npm install -g expo-cli eas-cli";
  };
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = [ "npx" "expo" "start" "--web" "--port" "$PORT" ];
        manager = "web";
        env = { PORT = "$PORT"; };
      };
    };
  };
}
