#!/usr/bin/env python3
"""
Test de fonctionnement de la base de données Anim'Média
Vérifie que tous les composants fonctionnent correctement
"""

import json
import os
import sys
from pathlib import Path

def test_json_files():
    """Test de validité des fichiers JSON"""
    print("🧪 Test des fichiers JSON...")
    
    json_files = {
        'data/events.json': 'Événements',
        'data/members.json': 'Membres', 
        'data/registrations.json': 'Inscriptions'
    }
    
    results = {}
    
    for file_path, description in json_files.items():
        try:
            if not os.path.exists(file_path):
                results[description] = f"❌ Fichier manquant: {file_path}"
                continue
                
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # Validation spécifique par type
            if 'events' in file_path:
                events = data.get('events', [])
                event_types = data.get('eventTypes', [])
                results[description] = f"✅ {len(events)} événements, {len(event_types)} types"
                
            elif 'members' in file_path:
                members = data.get('members', [])
                membership_types = data.get('membershipTypes', [])
                results[description] = f"✅ {len(members)} membres, {len(membership_types)} types d'adhésion"
                
            elif 'registrations' in file_path:
                registrations = data.get('registrations', [])
                waiting_list = data.get('waitingList', [])
                results[description] = f"✅ {len(registrations)} inscriptions, {len(waiting_list)} en attente"
                
        except json.JSONDecodeError as e:
            results[description] = f"❌ JSON invalide: {str(e)}"
        except Exception as e:
            results[description] = f"❌ Erreur: {str(e)}"
    
    return results

def test_data_consistency():
    """Test de cohérence des données"""
    print("🔍 Test de cohérence des données...")
    
    try:
        # Charger les données
        with open('data/events.json', 'r', encoding='utf-8') as f:
            events_data = json.load(f)
        with open('data/members.json', 'r', encoding='utf-8') as f:
            members_data = json.load(f)
        with open('data/registrations.json', 'r', encoding='utf-8') as f:
            registrations_data = json.load(f)
        
        events = events_data.get('events', [])
        members = members_data.get('members', [])
        registrations = registrations_data.get('registrations', [])
        
        # Tests de cohérence
        issues = []
        
        # 1. Vérifier les références des inscriptions
        event_ids = {event['id'] for event in events}
        member_ids = {member['id'] for member in members}
        
        for reg in registrations:
            if reg.get('eventId') not in event_ids:
                issues.append(f"Inscription {reg.get('id')} référence un événement inexistant: {reg.get('eventId')}")
            if reg.get('memberId') not in member_ids:
                issues.append(f"Inscription {reg.get('id')} référence un membre inexistant: {reg.get('memberId')}")
        
        # 2. Vérifier la cohérence des compteurs de participants
        for event in events:
            event_registrations = [r for r in registrations if r.get('eventId') == event['id'] and r.get('status') == 'confirmed']
            actual_count = len(event_registrations)
            declared_count = event.get('currentParticipants', 0)
            
            if actual_count != declared_count:
                issues.append(f"Événement {event['title']}: {declared_count} participants déclarés vs {actual_count} réels")
        
        return issues
        
    except Exception as e:
        return [f"Erreur lors du test de cohérence: {str(e)}"]

def test_upcoming_events():
    """Test des événements à venir"""
    print("📅 Test des événements à venir...")
    
    try:
        with open('data/events.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        events = data.get('events', [])
        
        from datetime import datetime
        now = datetime.now()
        
        upcoming_events = []
        for event in events:
            try:
                event_datetime = datetime.strptime(f"{event['date']} {event['time']}", "%Y-%m-%d %H:%M")
                if event_datetime >= now:
                    upcoming_events.append({
                        'title': event['title'],
                        'date': event['date'],
                        'time': event['time'],
                        'participants': f"{event.get('currentParticipants', 0)}/{event.get('maxParticipants', 0)}"
                    })
            except ValueError:
                continue
        
        return upcoming_events
        
    except Exception as e:
        return f"Erreur: {str(e)}"

def test_statistics():
    """Calcul des statistiques de base"""
    print("📊 Calcul des statistiques...")
    
    try:
        # Charger les données
        with open('data/events.json', 'r', encoding='utf-8') as f:
            events_data = json.load(f)
        with open('data/members.json', 'r', encoding='utf-8') as f:
            members_data = json.load(f)
        with open('data/registrations.json', 'r', encoding='utf-8') as f:
            registrations_data = json.load(f)
        
        events = events_data.get('events', [])
        members = members_data.get('members', [])
        registrations = registrations_data.get('registrations', [])
        
        # Statistiques de base
        stats = {
            'total_events': len(events),
            'total_members': len(members),
            'active_members': len([m for m in members if m.get('status') == 'active']),
            'total_registrations': len(registrations),
            'confirmed_registrations': len([r for r in registrations if r.get('status') == 'confirmed']),
            'total_revenue': sum(r.get('amount', 0) for r in registrations if r.get('paymentStatus') == 'paid'),
        }
        
        # Répartition par type d'événement
        event_types = {}
        for event in events:
            event_type = event.get('type', 'inconnu')
            event_types[event_type] = event_types.get(event_type, 0) + 1
        
        stats['event_types'] = event_types
        
        return stats
        
    except Exception as e:
        return f"Erreur: {str(e)}"

def main():
    """Fonction principale de test"""
    print("🎯 Test de Fonctionnement - Base de Données Anim'Média")
    print("=" * 60)
    
    # Test 1: Validité des fichiers JSON
    json_results = test_json_files()
    print("\n📁 Fichiers JSON:")
    for description, result in json_results.items():
        print(f"  {result}")
    
    # Test 2: Cohérence des données
    consistency_issues = test_data_consistency()
    print(f"\n🔍 Cohérence des données:")
    if consistency_issues:
        print(f"  ⚠️ {len(consistency_issues)} problème(s) détecté(s):")
        for issue in consistency_issues:
            print(f"    - {issue}")
    else:
        print("  ✅ Toutes les données sont cohérentes")
    
    # Test 3: Événements à venir
    upcoming = test_upcoming_events()
    print(f"\n📅 Événements à venir:")
    if isinstance(upcoming, list):
        if upcoming:
            print(f"  ✅ {len(upcoming)} événement(s) à venir:")
            for event in upcoming[:3]:  # Afficher les 3 prochains
                print(f"    - {event['title']} le {event['date']} à {event['time']} ({event['participants']})")
        else:
            print("  ⚠️ Aucun événement à venir")
    else:
        print(f"  ❌ {upcoming}")
    
    # Test 4: Statistiques
    stats = test_statistics()
    print(f"\n📊 Statistiques:")
    if isinstance(stats, dict):
        print(f"  👥 Membres: {stats['active_members']}/{stats['total_members']} actifs")
        print(f"  🎯 Événements: {stats['total_events']} total")
        print(f"  📝 Inscriptions: {stats['confirmed_registrations']}/{stats['total_registrations']} confirmées")
        print(f"  💰 Revenus: {stats['total_revenue']}€")
        print(f"  🎭 Types d'événements: {', '.join(f'{k}({v})' for k, v in stats['event_types'].items())}")
    else:
        print(f"  ❌ {stats}")
    
    # Conclusion
    print("\n" + "=" * 60)
    all_good = (
        all("✅" in result for result in json_results.values()) and
        not consistency_issues and
        isinstance(upcoming, list) and
        isinstance(stats, dict)
    )
    
    if all_good:
        print("🎉 RÉSULTAT: Base de données entièrement fonctionnelle!")
        print("✅ Tous les tests sont passés avec succès")
        print("✅ Le site est prêt à fonctionner avec les données JSON")
    else:
        print("⚠️ RÉSULTAT: Quelques problèmes détectés")
        print("📝 Consultez les détails ci-dessus pour les corrections nécessaires")
    
    return 0 if all_good else 1

if __name__ == "__main__":
    sys.exit(main())