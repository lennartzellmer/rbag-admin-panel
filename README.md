# RBAG Musik - Event Management Hub

**🚧 Repository in Bearbeitung**

Dies ist eine Event-Management-Anwendung für [RBAG Musik e.V.](https://www.rbag-musik.de/), die entwickelt wurde, um Musik- und Lernveranstaltungen zu verwalten, zu organisieren und zu erleichtern.

## Über uns

RBAG Musik organisiert Musikprojekte für Kinder, junge Erwachsene und Familien aus allen Hintergründen. Dieses Admin-Panel hilft dabei, die Verwaltung unserer Veranstaltungen zu optimieren, einschließlich unseres Flaggschiff-Projekts **Music&AL** mit Veranstaltungen das ganze Jahr über (Pfingsten, Sommerferien und Advent).

## Zweck

- **Event-Management**: Musik- und Lernveranstaltungen erstellen, organisieren und verwalten
- **Teilnehmerregistrierung**: Registrierungen für Kinder, Jugendliche und Familien bearbeiten
- **Administrative Tools**: Eventplanung und Koordinationsprozesse optimieren

## Zielgruppe

Unsere Veranstaltungen heißen willkommen:
- Kinder und junge Erwachsene
- Familien
- Menschen aller Ethnien und Hintergründe
- Musikbegeisterte aller Könnensstufen

## Externe Services

Diese Anwendung benötigt folgende externe Services, um vollständig funktionsfähig zu sein:

### 🔐 Zitadel (Identity & Access Management)
- **Zweck**: Benutzerauthentifizierung und Autorisierung

### 🗄️ MongoDB (Datenbank)
- **Zweck**: Hauptdatenbank für Event-Management und Benutzerdaten

### 📦 MinIO (S3-kompatible Objektspeicherung)
- **Zweck**: Datei-Upload und -Speicherung (z.B. Profilbilder, Event-Medien)


### 🚀 Schnellstart mit Docker

Alle Services können über Docker Compose gestartet werden. Für detaillierte Anweisungen, siehe [Docker Development Environment](dev_docker/README.md). 

---

*Für weitere Informationen über RBAG Musik und unsere Veranstaltungen besuchen Sie [www.rbag-musik.de](https://www.rbag-musik.de/) und [www.music-and-al.de](https://www.music-and-al.de)*
