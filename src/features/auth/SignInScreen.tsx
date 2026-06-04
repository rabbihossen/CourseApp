import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import {font, radius, spacing, text} from '../../theme';
import {useAuth} from './AuthContext';

export default function SignInScreen() {
  const {colors} = useTheme();
  const {signIn, signUp, continueAsGuest} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password required');
      return;
    }
    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError(null);
    setNotice(null);
    if (isSignUp) {
      const result = await signUp(email.trim(), password);
      setLoading(false);
      if (result.error) {
        setError(result.error);
      } else if (result.needsConfirmation) {
        setIsSignUp(false);
        setPassword('');
        setNotice('Account created. Check your email to confirm, then sign in.');
      }
      return;
    }
    const result = await signIn(email.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    }
  };

  const s = makeStyles(colors);

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.card}>
        <Text style={s.logo}>🎓</Text>
        <Text style={s.title}>CourseApp</Text>
        <Text style={s.subtitle}>{isSignUp ? 'Create your account' : 'Sign in to continue'}</Text>

        <TextInput
          style={s.input}
          placeholder="Email address"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
        />
        <TextInput
          style={s.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType={isSignUp ? 'newPassword' : 'password'}
        />

        {error ? <Text style={s.errorText}>{error}</Text> : null}
        {notice ? <Text style={s.noticeText}>{notice}</Text> : null}

        <TouchableOpacity
          style={s.btn}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.88}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.btnText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={s.switchBtn}
          onPress={() => {
            setIsSignUp(v => !v);
            setError(null);
            setNotice(null);
          }}>
          <Text style={s.switchText}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Text style={s.switchLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
          </Text>
        </TouchableOpacity>

        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>or</Text>
          <View style={s.dividerLine} />
        </View>

        <TouchableOpacity
          style={s.guestBtn}
          onPress={continueAsGuest}
          disabled={loading}
          activeOpacity={0.88}>
          <Text style={s.guestBtnText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: ReturnType<typeof import('../../theme/ThemeContext').useTheme>['colors']) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      padding: spacing[24],
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing[24],
      borderWidth: 1,
      borderColor: colors.border,
    },
    logo: {fontSize: 40, textAlign: 'center', marginBottom: spacing[8]},
    title: {
      ...text['2xl'],
      fontWeight: font.bold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing[4],
    },
    subtitle: {
      ...text.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing[24],
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing[16],
      paddingVertical: spacing[12],
      fontSize: 15,
      color: colors.text,
      marginBottom: spacing[12],
    },
    errorText: {
      ...text.sm,
      color: colors.error,
      marginBottom: spacing[12],
      textAlign: 'center',
    },
    noticeText: {
      ...text.sm,
      color: colors.indigo,
      marginBottom: spacing[12],
      textAlign: 'center',
    },
    btn: {
      backgroundColor: colors.indigo,
      borderRadius: radius.lg,
      paddingVertical: spacing[16],
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing[4],
    },
    btnText: {
      color: colors.textOnDark,
      fontWeight: font.bold,
      fontSize: 15,
    },
    switchBtn: {marginTop: spacing[20], alignItems: 'center'},
    switchText: {...text.sm, color: colors.textSecondary},
    switchLink: {color: colors.indigo, fontWeight: font.semibold},
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[20],
      marginBottom: spacing[16],
    },
    dividerLine: {flex: 1, height: 1, backgroundColor: colors.border},
    dividerText: {
      ...text.sm,
      color: colors.textMuted,
      marginHorizontal: spacing[12],
    },
    guestBtn: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      paddingVertical: spacing[16],
      alignItems: 'center',
      justifyContent: 'center',
    },
    guestBtnText: {
      color: colors.text,
      fontWeight: font.semibold,
      fontSize: 15,
    },
  });
}
