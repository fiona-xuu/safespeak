import { StyleSheet, View, Text } from 'react-native';

export default function LocationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Location</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

