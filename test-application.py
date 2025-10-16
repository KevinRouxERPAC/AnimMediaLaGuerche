#!/usr/bin/env python3
"""
Tests automatisés pour l'application Anim'Média
Vérifie le fonctionnement de l'API et des fonctionnalités sécurisées
"""

import requests
import json
import time
from datetime import datetime

# Configuration des tests
BASE_URL = "http://localhost:8000"
TEST_USER = {"username": "admin", "password": "animmedia2024"}

class AnimMediaTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.access_token = None
        self.session = requests.Session()
        
    def print_test(self, test_name, status, message=""):
        """Afficher le résultat d'un test"""
        icon = "✅" if status else "❌"
        print(f"{icon} {test_name}")
        if message:
            print(f"   {message}")
    
    def test_server_running(self):
        """Test si le serveur répond"""
        try:
            response = self.session.get(f"{self.base_url}/")
            success = response.status_code == 200
            self.print_test("Serveur accessible", success, 
                          f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.print_test("Serveur accessible", False, str(e))
            return False
    
    def test_events_api(self):
        """Test de l'API des événements (public)"""
        try:
            response = self.session.get(f"{self.base_url}/api/events")
            data = response.json()
            
            success = (response.status_code == 200 and 
                      data.get('success') == True and
                      'events' in data)
            
            self.print_test("API Événements (public)", success,
                          f"Événements trouvés: {len(data.get('events', []))}")
            return success
        except Exception as e:
            self.print_test("API Événements (public)", False, str(e))
            return False
    
    def test_admin_login(self):
        """Test de connexion admin"""
        try:
            login_data = TEST_USER
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                headers={'Content-Type': 'application/json'},
                data=json.dumps(login_data)
            )
            
            if response.status_code == 200:
                data = response.json()
                self.access_token = data.get('access_token')
                success = bool(self.access_token)
                
                self.print_test("Connexion Admin", success,
                              f"Utilisateur: {data.get('user', {}).get('name', 'N/A')}")
                return success
            else:
                error = response.json().get('error', 'Erreur inconnue')
                self.print_test("Connexion Admin", False, f"Erreur: {error}")
                return False
                
        except Exception as e:
            self.print_test("Connexion Admin", False, str(e))
            return False
    
    def test_protected_endpoint(self):
        """Test d'un endpoint protégé (stats)"""
        if not self.access_token:
            self.print_test("Endpoint protégé", False, "Pas de token d'accès")
            return False
        
        try:
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            response = self.session.get(
                f"{self.base_url}/api/stats/dashboard",
                headers=headers
            )
            
            success = response.status_code == 200
            if success:
                data = response.json()
                stats = data.get('stats', {})
                self.print_test("Endpoint protégé (stats)", True,
                              f"Stats: {stats.get('totalEvents', 0)} événements")
            else:
                error = response.json().get('error', 'Erreur inconnue')
                self.print_test("Endpoint protégé (stats)", False, f"Erreur: {error}")
            
            return success
            
        except Exception as e:
            self.print_test("Endpoint protégé (stats)", False, str(e))
            return False
    
    def test_event_creation(self):
        """Test de création d'événement"""
        if not self.access_token:
            self.print_test("Création d'événement", False, "Pas de token d'accès")
            return False
        
        try:
            # Données de test pour un événement
            test_event = {
                "title": f"Test Événement {datetime.now().strftime('%H%M%S')}",
                "type": "atelier",
                "description": "Événement créé automatiquement par les tests",
                "date": "2025-12-31",
                "time": "14:00",
                "duration": 120,
                "location": "Test Location",
                "address": "123 Test Street, Test City",
                "instructor": "Test Instructor",
                "maxParticipants": 10,
                "price": 15.0,
                "level": "Débutant"
            }
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            response = self.session.post(
                f"{self.base_url}/api/events",
                headers=headers,
                data=json.dumps(test_event)
            )
            
            success = response.status_code == 201
            if success:
                data = response.json()
                event = data.get('event', {})
                self.print_test("Création d'événement", True,
                              f"Événement créé: {event.get('id', 'N/A')}")
                return event.get('id')
            else:
                error = response.json().get('error', 'Erreur inconnue')
                self.print_test("Création d'événement", False, f"Erreur: {error}")
                return False
                
        except Exception as e:
            self.print_test("Création d'événement", False, str(e))
            return False
    
    def test_registration(self):
        """Test d'inscription à un événement"""
        try:
            # Obtenir un événement existant
            response = self.session.get(f"{self.base_url}/api/events")
            events_data = response.json()
            
            if not events_data.get('events'):
                self.print_test("Test d'inscription", False, "Aucun événement disponible")
                return False
            
            event = events_data['events'][0]
            event_id = event.get('id')
            
            # Données d'inscription de test
            registration_data = {
                "eventId": event_id,
                "memberName": f"Test User {datetime.now().strftime('%H%M%S')}",
                "memberEmail": "test@example.com",
                "memberPhone": "0123456789",
                "notes": "Inscription de test automatique"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/registrations",
                headers={'Content-Type': 'application/json'},
                data=json.dumps(registration_data)
            )
            
            success = response.status_code == 201
            if success:
                data = response.json()
                reg = data.get('registration', {})
                self.print_test("Inscription à un événement", True,
                              f"Inscription créée: {reg.get('id', 'N/A')}")
            else:
                error = response.json().get('error', 'Erreur inconnue')
                self.print_test("Inscription à un événement", False, f"Erreur: {error}")
            
            return success
            
        except Exception as e:
            self.print_test("Inscription à un événement", False, str(e))
            return False
    
    def test_security_headers(self):
        """Test des headers de sécurité"""
        try:
            response = self.session.get(f"{self.base_url}/")
            headers = response.headers
            
            security_headers = [
                'X-Content-Type-Options',
                'X-Frame-Options', 
                'X-XSS-Protection',
                'Content-Security-Policy'
            ]
            
            missing_headers = []
            for header in security_headers:
                if header not in headers:
                    missing_headers.append(header)
            
            success = len(missing_headers) == 0
            message = f"Headers manquants: {missing_headers}" if missing_headers else "Tous les headers présents"
            
            self.print_test("Headers de sécurité", success, message)
            return success
            
        except Exception as e:
            self.print_test("Headers de sécurité", False, str(e))
            return False
    
    def test_rate_limiting(self):
        """Test du rate limiting"""
        try:
            # Essayer de faire plusieurs requêtes rapidement
            login_url = f"{self.base_url}/api/auth/login"
            bad_credentials = {"username": "wrong", "password": "wrong"}
            
            responses = []
            for i in range(7):  # Dépasser la limite de 5/minute
                response = self.session.post(
                    login_url,
                    headers={'Content-Type': 'application/json'},
                    data=json.dumps(bad_credentials)
                )
                responses.append(response.status_code)
                time.sleep(0.1)
            
            # Vérifier qu'au moins une requête a été limitée (429)
            success = 429 in responses
            message = f"Codes de réponse: {set(responses)}"
            
            self.print_test("Rate Limiting", success, message)
            return success
            
        except Exception as e:
            self.print_test("Rate Limiting", False, str(e))
            return False
    
    def run_all_tests(self):
        """Exécuter tous les tests"""
        print("🧪 TESTS AUTOMATISÉS ANIM'MÉDIA")
        print("=" * 40)
        
        tests = [
            ("Serveur", self.test_server_running),
            ("API Événements", self.test_events_api),
            ("Connexion Admin", self.test_admin_login),
            ("Endpoint Protégé", self.test_protected_endpoint),
            ("Création Événement", self.test_event_creation),
            ("Inscription", self.test_registration),
            ("Headers Sécurité", self.test_security_headers),
            ("Rate Limiting", self.test_rate_limiting)
        ]
        
        results = []
        for test_name, test_func in tests:
            print(f"\n🔍 Test: {test_name}")
            try:
                result = test_func()
                results.append((test_name, result))
            except Exception as e:
                print(f"❌ Erreur dans {test_name}: {e}")
                results.append((test_name, False))
        
        # Résumé
        print("\n" + "=" * 40)
        print("📊 RÉSUMÉ DES TESTS")
        print("=" * 40)
        
        passed = sum(1 for _, result in results if result)
        total = len(results)
        
        for test_name, result in results:
            status = "✅ PASSÉ" if result else "❌ ÉCHEC"
            print(f"{status:12} {test_name}")
        
        print(f"\n🎯 Score: {passed}/{total} tests réussis")
        
        if passed == total:
            print("🎉 TOUS LES TESTS SONT PASSÉS !")
            print("✅ L'application est prête pour la production")
        else:
            print("⚠️  Certains tests ont échoué")
            print("🔧 Vérifiez la configuration avant le déploiement")
        
        return passed == total

def main():
    """Fonction principale"""
    tester = AnimMediaTester()
    
    print(f"🚀 Démarrage des tests sur {BASE_URL}")
    print(f"⏰ Heure: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    success = tester.run_all_tests()
    
    if success:
        exit(0)
    else:
        exit(1)

if __name__ == "__main__":
    main()