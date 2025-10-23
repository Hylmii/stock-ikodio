import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { formatDate } from '@project-ikodiomain/utils';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Project Ikodiomain</Text>
          <Text style={styles.subtitle}>React Native App</Text>
          <Text style={styles.date}>Last updated: {formatDate(new Date())}</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}> Mobile Application</Text>
            <Text style={styles.cardText}>
              Built with React Native, sharing components and utilities with the web app.
            </Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}> Shared Dependencies</Text>
            <Text style={styles.cardText}>
              Using shared UI components and utilities from the monorepo packages.
            </Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}> Turbo Powered</Text>
            <Text style={styles.cardText}>
              Fast development and builds with Turborepo caching and parallel execution.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: '#9ca3af',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default App;