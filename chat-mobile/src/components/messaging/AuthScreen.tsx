import ArrowRight from 'lucide-react-native/icons/arrow-right';
import Eye from 'lucide-react-native/icons/eye';
import EyeOff from 'lucide-react-native/icons/eye-off';
import LockKeyhole from 'lucide-react-native/icons/lock-keyhole';
import Mail from 'lucide-react-native/icons/mail';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import UserRound from 'lucide-react-native/icons/user-round';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, styles } from './styles';

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
  feedback: { text: string; success?: boolean } | null;
  setAuthMode: (mode: 'register' | 'login') => void;
}

export function AuthScreen({
  authMode, name, setName, email, setEmail, password, setPassword,
  otpCode, setOtpCode, showPassword, setShowPassword,
  handleRegister, handleLogin, handleVerifyOtp, handleResendOtp, feedback, setAuthMode,
}: AuthScreenProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 820;
  const registering = authMode === 'register';
  const verifying = authMode === 'otp';
  const submit = verifying ? handleVerifyOtp : registering ? handleRegister : handleLogin;

  return (
    <SafeAreaView style={auth.page}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={auth.scroll}>
        <View style={[auth.shell, styles.shadow, wide && auth.wide]}>
          <View style={[auth.brand, wide && auth.brandWide]}>
            <View style={auth.brandName}>
              <View style={auth.brandMark}><MessageCircle size={22} color={colors.accentDark} /></View>
              <Text style={auth.wordmark}>tuchat</Text>
            </View>
            {wide && (
              <>
                <View style={auth.ring} />
                <View style={[auth.ring, auth.innerRing]} />
                <View style={auth.art} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                  <View style={auth.artBubble}><MessageCircle size={53} strokeWidth={1.4} color={colors.accentDark} /></View>
                  <View style={[auth.artBubble, auth.replyBubble]}><Text style={auth.replyDots}>•••</Text></View>
                </View>
                <Text style={auth.brandTitle}>Keep in touch.</Text>
                <Text style={auth.brandSubtitle}>Private chats, groups, and channels.</Text>
              </>
            )}
          </View>

          <View style={auth.form}>
            <View style={auth.intro}>
              <Text accessibilityRole="header" style={styles.title}>
                {verifying ? 'Verify your email' : registering ? 'Create your account' : 'Welcome back'}
              </Text>
              <Text style={styles.subtitle}>
                {verifying ? `Enter the six-digit code sent to ${email}.` : registering ? 'Sign up to start chatting on TuChat.' : 'Log in to open your chats.'}
              </Text>
            </View>

            {verifying ? (
              <View style={auth.field}>
                <Text style={styles.label}>Verification code</Text>
                <TextInput accessibilityLabel="Verification code" style={styles.input} placeholder="000000" value={otpCode} onChangeText={setOtpCode} keyboardType="number-pad" maxLength={6} onSubmitEditing={submit} />
              </View>
            ) : (
              <>
                {registering && (
                  <View style={auth.field}>
                    <Text style={styles.label}>Full name</Text>
                    <View style={auth.inputRow}>
                      <UserRound size={18} color={colors.muted} />
                      <TextInput accessibilityLabel="Full name" style={auth.input} placeholder="Your name" value={name} onChangeText={setName} autoComplete="name" />
                    </View>
                  </View>
                )}
                <View style={auth.field}>
                  <Text style={styles.label}>Email</Text>
                  <View style={auth.inputRow}>
                    <Mail size={18} color={colors.muted} />
                    <TextInput accessibilityLabel="Email" style={auth.input} placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
                  </View>
                </View>
                <View style={auth.field}>
                  <Text style={styles.label}>Password</Text>
                  <View style={auth.inputRow}>
                    <LockKeyhole size={18} color={colors.muted} />
                    <TextInput accessibilityLabel="Password" style={auth.input} placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoComplete={registering ? 'new-password' : 'current-password'} onSubmitEditing={submit} />
                    <Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                      {showPassword ? <EyeOff size={19} color={colors.muted} /> : <Eye size={19} color={colors.muted} />}
                    </Pressable>
                  </View>
                </View>
              </>
            )}

            {feedback && <Text accessibilityRole="alert" style={{ color: feedback.success ? colors.accent : colors.danger }}>{feedback.text}</Text>}
            <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={submit}>
              <Text style={styles.buttonText}>{verifying ? 'Verify account' : registering ? 'Create account' : 'Log in'}</Text>
              <ArrowRight size={17} color={colors.paper} />
            </Pressable>
            <View style={auth.footer}>
              <Text style={styles.subtitle}>{verifying ? 'Didn’t get the code?' : registering ? 'Already have an account?' : 'New to TuChat?'}</Text>
              <Pressable accessibilityRole="button" onPress={verifying ? handleResendOtp : () => setAuthMode(registering ? 'login' : 'register')}>
                <Text style={styles.link}>{verifying ? 'Resend code' : registering ? 'Log in' : 'Sign up'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const auth = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  shell: { width: '100%', maxWidth: 960, borderRadius: 26, overflow: 'hidden', backgroundColor: colors.paper },
  wide: { flexDirection: 'row', minHeight: 590 },
  brand: { backgroundColor: colors.accentDark, padding: 24, overflow: 'hidden' },
  brandWide: { flex: 1, justifyContent: 'flex-end', padding: 36 },
  brandName: { flexDirection: 'row', gap: 10, alignItems: 'center', zIndex: 1 },
  brandMark: { width: 38, height: 38, backgroundColor: '#9de5c3', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  wordmark: { color: colors.paper, fontSize: 23, fontWeight: '800', letterSpacing: -0.6 },
  brandTitle: { color: colors.paper, fontSize: 44, fontWeight: '800', letterSpacing: -1.5 },
  brandSubtitle: { color: '#b8d9ce', fontSize: 16, marginTop: 8 },
  ring: { position: 'absolute', width: 460, height: 460, borderRadius: 230, borderWidth: 1, borderColor: '#366357', top: -110, left: -110 },
  innerRing: { top: -68, left: -68, width: 376, height: 376, borderRadius: 188 },
  art: { flex: 1, minHeight: 220, justifyContent: 'center', alignItems: 'center' },
  artBubble: { transform: [{ rotate: '-12deg' }], width: 126, height: 96, borderRadius: 29, borderBottomLeftRadius: 8, backgroundColor: '#9de5c3', alignItems: 'center', justifyContent: 'center' },
  replyBubble: { width: 77, height: 55, marginLeft: 102, marginTop: -12, borderBottomLeftRadius: 26, borderBottomRightRadius: 7, backgroundColor: '#f7d8a1', transform: [{ rotate: '10deg' }] },
  replyDots: { color: colors.accentDark, fontSize: 23, letterSpacing: 3, fontWeight: '800' },
  form: { flex: 1.12, justifyContent: 'center', padding: 24, gap: 16 },
  intro: { gap: 6, marginBottom: 6 },
  field: { gap: 7 },
  inputRow: { ...styles.input, flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, minWidth: 0, minHeight: 50, color: colors.ink, fontSize: 16 },
  footer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 7 },
});
