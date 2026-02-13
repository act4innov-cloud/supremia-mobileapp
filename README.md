# 🤖 SUPREMIA Platform - Industrial Monitoring & Control

<p align="center">
  <img src="docs/logo-placeholder.png" alt="SUPREMIA Logo" width="200"/>
  <br/>
  <strong>Plateforme Mobile Industrielle de Supervision et Contrôle</strong>
  <br/>
  <em>OCP Morocco - Jorf Lasfar & Safi Chemical Plants</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.76-blue?logo=react" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-52-black?logo=expo" alt="Expo"/>
  <img src="https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase" alt="Firebase"/>
  <img src="https://img.shields.io/badge/MQTT-Protocol-purple?logo=eclipsemosquitto" alt="MQTT"/>
  <img src="https://img.shields.io/badge/Platform-Android_iOS_Web-green" alt="Platforms"/>
</p>

---

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Stack Technique](#stack-technique)
- [Installation](#installation)
- [Configuration](#configuration)
- [Déploiement](#déploiement)
- [Structure du Projet](#structure-du-projet)
- [API & Protocoles](#api--protocoles)
- [Sécurité](#sécurité)
- [Contribution](#contribution)

---

## 🏭 Vue d'ensemble

**SUPREMIA Platform** est une application mobile cross-platform (Android, iOS, Web) dédiée à la supervision industrielle en temps réel des installations chimiques OCP. Elle assure :

- **Monitoring des gaz** (H₂S, CO₂, CO, NH₃, SO₂) via capteurs IoT
- **Contrôle des caméras PTZ** pour l'inspection visuelle à distance
- **Dashboard temps réel** de l'état des unités de production
- **Reporting & Archivage** des données de surveillance
- **Administration** complète des capteurs, unités et dashboards

### Cas d'usage principaux

| Utilisateur | Besoin |
|---|---|
| Opérateur terrain | Visualiser les niveaux de gaz en temps réel sur mobile/tablette |
| Responsable sécurité | Recevoir les alertes critiques et consulter l'historique |
| Technicien maintenance | Contrôler les caméras PTZ et inspecter les zones à distance |
| Administrateur | Configurer les unités, capteurs et personnaliser les dashboards |

---

## 🏗️ Architecture