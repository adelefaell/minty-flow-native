---
name: react-native-design
description: Master React Native styling, navigation, and Reanimated animations for cross-platform mobile development. Use when building React Native apps, implementing navigation patterns, or creating performant animations.
---

# React Native Design

Master React Native styling with **Unistyles**, pager-based navigation, and Reanimated 3 to build performant, cross-platform mobile applications with native-quality user experiences.

This approach leans toward **design systems, tokens, and spatial navigation** rather than scattered StyleSheets and deeply nested stacks.

## When to Use This Skill

* Building cross-platform mobile apps with React Native
* Styling with **Unistyles** and design tokens
* Implementing **Pager navigation** (horizontal / vertical flows)
* Creating performant animations with Reanimated 3
* Building responsive layouts with breakpoints
* Implementing platform-specific designs (iOS/Android)
* Creating gesture-driven interactions
* Optimizing React Native performance

## Core Concepts

### 1. Unistyles and Design Tokens

Unistyles replaces ad-hoc `StyleSheet.create` with a **theme-driven, reactive styling system**. Styles become functions of your design system, not random objects.

**Theme setup:**

```ts
// styles/theme.ts
import { createTheme } from 'react-native-unistyles';

export const lightTheme = createTheme({
  colors: {
    background: '#ffffff',
    text: '#1a1a1a',
    primary: '#6366f1',
    muted: '#6b7280',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
});
```

**Using Unistyles:**

```ts
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View, Text } from 'react-native';

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
  },
}));

function Card() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
    </View>
  );
}
```

The philosophical shift:
**styles are no longer constants, they are projections of a theme**.

You get:

* Dark mode for free
* Breakpoints
* Platform variants
* Runtime theming without re-renders

---

### 2. Responsive Layouts with Unistyles

Unistyles has first-class support for **breakpoints and variants**.

```ts
const stylesheet = createStyleSheet(theme => ({
  card: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    variants: {
      size: {
        sm: { padding: theme.spacing.sm },
        lg: { padding: theme.spacing.lg },
      },
    },
  },
}));
```

```ts
<View style={styles.card({ size: 'lg' })} />
```

This feels closer to Tailwind or CSS design systems, but stays fully native.

---

### 3. Pager-Based Navigation

Instead of thinking purely in stacks and tabs, you think in **spaces**.

Pager navigation is about:

* Horizontal flows (onboarding, steps, sections)
* Vertical feeds
* Gesture-native transitions

Using `react-native-pager-view`:

```ts
import PagerView from 'react-native-pager-view';
import { View, Text } from 'react-native';

export function MainPager() {
  return (
    <PagerView style={{ flex: 1 }} initialPage={0}>
      <View key="1">
        <Text>Home</Text>
      </View>
      <View key="2">
        <Text>Search</Text>
      </View>
      <View key="3">
        <Text>Profile</Text>
      </View>
    </PagerView>
  );
}
```

Mentally, this is closer to:

* iOS page controllers
* TikTok/Instagram vertical swipes
* Figma pages

Navigation becomes **spatial**, not hierarchical.

Stacks still exist, but they’re supporting actors, not the main character.

---

### 4. Pager + Reanimated = Native Feel

Pager really shines when driven by Reanimated.

```ts
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

function AnimatedIndicator({ index }: { index: number }) {
  const progress = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 40 }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
}
```

This lets you build:

* Tab indicators
* Page progress bars
* Parallax headers
* TikTok-style snap physics

All on the UI thread. No JS traffic jams.

---

### 5. Platform-Specific Styling with Unistyles

Instead of `Platform.select`, Unistyles bakes it into the theme.

```ts
const stylesheet = createStyleSheet(theme => ({
  card: {
    padding: theme.spacing.md,
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
  },
}));
```

Same idea, but now it’s part of your **design system**, not random conditionals.

---

## Quick Start Component (Unistyles + Reanimated)

```ts
import { View, Text, Image, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const stylesheet = createStyleSheet(theme => ({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  subtitle: {
    color: theme.colors.muted,
  },
}));

export function ItemCard({ title, subtitle, imageUrl }) {
  const { styles } = useStyles(stylesheet);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.97))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
```

This is the “modern RN triangle”:
**Unistyles for structure, Reanimated for motion, Pager for space.**

---

## Best Practices (Updated)

* Use **Unistyles** instead of raw StyleSheet
* Centralize colors, spacing, radius, typography in themes
* Think in **pages and flows**, not just stacks
* Use **Pager for primary navigation**, Stack for modals/details
* Run animations on UI thread with Reanimated
* Use FlatList for long lists
* Test gestures on real devices
* Let design tokens drive everything

---

## Conceptual Shift (The Important Part)

Old mental model:

> Screen → Stack → Tab → Component → StyleSheet

New mental model:

> Theme → Space (Pager) → Motion → Component → Variants

You stop asking:
“How do I navigate to this screen?”

And start asking:
“What space does the user flow through next?”

That’s the difference between an app that feels like **a website in a phone**
and one that feels like **a physical object you’re moving through**.


## Resources 
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)  
- [Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/) 
- [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) 
- [Expo Documentation](https://docs.expo.dev/)



# React Native Unistyles 3.0

> Easily style cross platform React Native apps with a single StyleSheet

This documentation site is a source of truth for the good practices while building apps with React Native Unistyles.

## Documentation Sets

- [Abridged documentation](https://unistyl.es/llms-small.txt): a compact version of the documentation for React Native Unistyles 3.0, with non-essential content removed
- [Complete documentation](https://unistyl.es/llms-full.txt): the full documentation for React Native Unistyles 3.0

## Notes

- The complete documentation includes all content from the official documentation
- The content is automatically generated from the same source as the official documentation
