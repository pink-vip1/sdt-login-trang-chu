import React, { useState, createContext, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  const login = (phone) => {
    setUserPhone(phone);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserPhone('');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userPhone, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  const { userPhone, logout } = useContext(AuthContext);

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeText}>Xin chào {userPhone}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\s/g, ''); 
    const regex = /^(0[35789])[0-9]{8}$/;
    return regex.test(cleaned);
  };

  const handleTextChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.slice(0, 10);
    
    let formatted = match;
    if (match.length > 3 && match.length <= 6) {
      formatted = `${match.slice(0, 3)} ${match.slice(3)}`;
    } else if (match.length > 6 && match.length <= 8) {
      formatted = `${match.slice(0, 3)} ${match.slice(3, 6)} ${match.slice(6)}`;
    } else if (match.length > 8) {
      formatted = `${match.slice(0, 3)} ${match.slice(3, 6)} ${match.slice(6, 8)} ${match.slice(8, 10)}`;
    }

    setPhoneNumber(formatted);

    if (formatted.length > 0) {
      const isComplete = formatted.replace(/\s/g, '').length === 10;
      if (isComplete && !validatePhone(formatted)) {
        setError('Số điện thoại không đúng định dạng (VD: 09x, 03x...)');
      } else {
        setError(''); 
      }
    } else {
      setError('');
    }
  };

  const handleContinue = () => {
    if (!phoneNumber) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setError('Số điện thoại không hợp lệ, vui lòng kiểm tra lại!');
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ!');
      return;
    }

    setError('');
    login(phoneNumber);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đăng nhập</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Nhập số điện thoại</Text>
        <Text style={styles.subtitle}>
          Dùng số điện thoại để đăng nhập hoặc đăng ký tài khoản OneHousing Pro
        </Text>

        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="09..."
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={handleTextChange}
          maxLength={13} 
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const AppNavigator = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    lineHeight: 20,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 5,
    color: '#000',
  },
  inputError: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#302AF2', 
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  homeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#302AF2',
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    elevation: 2, 
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});