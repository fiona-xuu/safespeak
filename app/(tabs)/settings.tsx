import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  user_id: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [isContactExpanded, setIsContactExpanded] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching contacts:', error);
      } else {
        setContacts(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
      alert('Error logging out. Please try again.');
    }
  };

  const toggleContact = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsContactExpanded(!isContactExpanded);
    if (isContactExpanded) {
      // Reset adding state when collapsing the main section
      setIsAddingContact(false);
    }
  };

  const addContact = async () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      Alert.alert('Error', 'Please fill in both name and phone number.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to save contacts.');
        return;
      }

      const newContact = {
        user_id: user.id,
        name: contactName.trim(),
        phone: contactPhone.trim(),
      };

      const { data, error } = await supabase
        .from('contacts')
        .insert([newContact])
        .select()
        .single();

      if (error) {
        console.error('Error adding contact:', error);
        Alert.alert('Error Saving Contact', `Supabase Error: ${error.message || JSON.stringify(error)}`);
        return;
      }

      if (data) {
        setContacts([...contacts, data]);
        setContactName('');
        setContactPhone('');
        
        // Close the form after adding
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsAddingContact(false);
      }
    } catch (error) {
      console.error('Unexpected error adding contact:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const removeContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contact:', error);
        Alert.alert('Error', 'Failed to delete contact.');
        return;
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error('Unexpected error deleting contact:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.menu}>
        <View style={styles.menuItem}>
          <Text style={styles.welcomeText}>Welcome!</Text>
        </View>
        <View style={styles.separator} />
        
        {/* Contact Selection Item */}
        <TouchableOpacity style={styles.menuItem} onPress={toggleContact} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuText}>Contact Selection</Text>
            {contacts.length > 0 && !isContactExpanded && (
              <Text style={styles.savedContactPreview}>
                {contacts.length} saved contact{contacts.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
          <IconSymbol 
            name={isContactExpanded ? "chevron.down" : "chevron.right"} 
            size={20} 
            color="#966585" 
          />
        </TouchableOpacity>

        {/* Collapsible Contact Area */}
        {isContactExpanded && (
          <View style={styles.contactSection}>
            
            {/* List of Added Contacts */}
            {contacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <TouchableOpacity onPress={() => removeContact(contact.id)} style={styles.deleteButton}>
                  <IconSymbol name="xmark.circle.fill" size={24} color="#de665e" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add New Contact Logic */}
            {!isAddingContact ? (
              <TouchableOpacity 
                style={styles.showFormButton}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setIsAddingContact(true);
                }}
              >
                <IconSymbol name="plus.circle.fill" size={24} color="#faacdd" />
                <Text style={styles.showFormButtonText}>Add New Contact</Text>
              </TouchableOpacity>
            ) : (
              /* Add New Contact Form */
              <View style={styles.contactForm}>
                <Text style={styles.formTitle}>Add New Contact</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Jane Doe"
                    placeholderTextColor="#999"
                    value={contactName}
                    onChangeText={setContactName}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 5551234567"
                    placeholderTextColor="#999"
                    value={contactPhone}
                    onChangeText={(text) => {
                      const numbersOnly = text.replace(/[^0-9]/g, '');
                      if (numbersOnly.length <= 10) {
                        setContactPhone(numbersOnly);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>

                <View style={styles.formButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setIsAddingContact(false);
                      setContactName('');
                      setContactPhone('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.addButton} onPress={addContact}>
                    <Text style={styles.addButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.separator} />

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={[styles.menuText, styles.logoutText]}>Log out</Text>
          <IconSymbol name="chevron.right" size={20} color="#966585" />
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
    </ScrollView>
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
  menuItemLeft: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'System',
  },
  savedContactPreview: {
    fontSize: 12,
    color: '#966585',
    marginTop: 2,
  },
  welcomeText: {
    fontSize: 24,
    color: '#000',
    fontFamily: 'System',
    fontWeight: '600',
  },
  logoutText: {
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#966585',
    opacity: 0.3,
  },
  // Contact Section Styles
  contactSection: {
    marginBottom: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 5,
  },
  // Show Form Button
  showFormButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#faacdd',
    borderStyle: 'dashed',
  },
  showFormButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#966585',
    fontWeight: '600',
  },
  // Contact Form Styles
  contactForm: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    marginTop: 5,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#966585',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#000',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 5,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#faacdd',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
