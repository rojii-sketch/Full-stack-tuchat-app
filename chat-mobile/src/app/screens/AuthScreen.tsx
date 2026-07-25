import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

interface AuthScreenProps {
  authMode: 'register' | 'login' | 'otp';
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  otpCode: string;
  setOtpCode: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  handleRegister: () => void;
  handleLogin: () => void;
  handleVerifyOtp: () => void;
  handleResendOtp: () => void;
  setAuthMode: (mode: 'register' | 'login' | 'otp' | 'inbox' | 'chat' | 'profile') => void;
}

export function AuthScreen({
  authMode, name, setName, email, setEmail, password, setPassword,
  otpCode, setOtpCode, showPassword, setShowPassword,
  handleRegister, handleLogin, handleVerifyOtp, handleResendOtp, setAuthMode
}: AuthScreenProps) {
  if (authMode === 'register') {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Create tuchat</Text>
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <View style={styles.passwordContainer}>
          <TextInput style={styles.passwordInput} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAuthMode('login')}>
          <Text style={styles.switchText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (authMode === 'login') {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Welcome to tuchat</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <View style={styles.passwordContainer}>
          <TextInput style={styles.passwordInput} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAuthMode('register')}>
          <Text style={styles.switchText}>Need an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>Verify Email</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to {email}</Text>
      <TextInput style={styles.input} placeholder="Enter OTP Code" value={otpCode} onChangeText={setOtpCode} keyboardType="number-pad" maxLength={6} />
      <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResendOtp}>
        <Text style={styles.switchText}>Didn't receive a code? Resend</Text>
      </TouchableOpacity>
    </View>
  );
}