import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { Link } from 'expo-router';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Plant } from '@/types/plant.types';

export default function AdminDashboard() {
  const [plants, setPlants] = React.useState<Plant[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(firestore, 'plants'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const plantsData: Plant[] = [];
      querySnapshot.forEach((doc) => {
        plantsData.push({ id: doc.id, ...doc.data() } as Plant);
      });
      setPlants(plantsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator animating={true} style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin - OCP Plants</Text>
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/admin/plant/${item.id}`} asChild>
            <Card style={styles.card}>
              <Card.Title title={item.name} subtitle={item.location.city} />
              <Card.Content>
                <Text>{item.description}</Text>
                <Text style={{ marginTop: 8 }}>Status: {item.status}</Text>
              </Card.Content>
            </Card>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
});
