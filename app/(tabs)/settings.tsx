import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <Text style={styles.welcomeText}>Welcome!</Text>
        </View>
        <View style={styles.separator} />
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Contact Selection</Text>
          <IconSymbol name="chevron.right" size={20} color="#966585" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Command Selection</Text>
          <IconSymbol name="chevron.right" size={20} color="#966585" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacy</Text>
          <IconSymbol name="chevron.right" size={20} color="#966585" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Your Information and Permissions</Text>
          <IconSymbol name="chevron.right" size={20} color="#966585" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={[styles.menuText, styles.logoutText]}>Log out</Text>
          <IconSymbol name="chevron.right" size={20} color="#966585" />
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcecf6',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  menu: {
    backgroundColor: 'transparent',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'System',
  },
  welcomeText: {
    fontSize: 24,
    color: '#000',
    fontFamily: 'System',
    fontWeight: '600',
  },
  logoutText: {
    color: '#000', // Or a different color if preferred
  },
  separator: {
    height: 1,
    backgroundColor: '#966585',
    opacity: 0.3,
  },
});
