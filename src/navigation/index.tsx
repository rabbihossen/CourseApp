import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CourseListScreen from '../features/courses/screens/CourseListScreen';
import CourseDetailScreen from '../features/courses/screens/CourseDetailScreen';
import SignInScreen from '../features/auth/SignInScreen';
import {useAuth} from '../features/auth/AuthContext';
import {useTheme} from '../theme/ThemeContext';
import {font} from '../theme';

export type RootStackParamList = {
  CourseList: undefined;
  CourseDetail: {courseId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['courseapp://'],
  config: {
    screens: {
      CourseList: 'courses',
      CourseDetail: 'course/:courseId',
    },
  },
};

export default function Navigation() {
  const {session, isGuest, isLoading} = useAuth();
  const {colors} = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.loader, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.indigo} />
      </View>
    );
  }

  if (!session && !isGuest) {
    return <SignInScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: colors.surface},
          headerTitleStyle: {
            fontWeight: font.semibold,
            fontSize: 16,
            color: colors.text,
          },
          headerTintColor: colors.indigo,
          headerShadowVisible: false,
          contentStyle: {backgroundColor: colors.background},
        }}>
        <Stack.Screen
          name="CourseList"
          component={CourseListScreen}
          options={{
            headerTitle: 'Courses',
            headerLargeTitle: false,
          }}
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{
            headerBackTitle: 'Back',
            headerTitle: '',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
