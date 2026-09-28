import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { APP_CONFIG } from '~/config';

type Props = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  /** Trait coloré à gauche, pour signaler une alerte. */
  accent?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Conteneur de base des cartes du dashboard et de la liste des capteurs. */
export function Card({ children, title, subtitle, accent, style, contentStyle }: Props) {
  return (
    <View style={[styles.card, style]}>
      {accent !== undefined && <View style={[styles.accent, { backgroundColor: accent }]} />}
      {(title !== undefined || subtitle !== undefined) && (
        <View style={styles.header}>
          {title !== undefined && <Text style={styles.title}>{title}</Text>}
          {subtitle !== undefined && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    overflow: 'hidden',
  },
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  header: { gap: 2, paddingLeft: 4 },
  title: { color: APP_CONFIG.colors.text, fontSize: 15, fontWeight: '700' },
  subtitle: { color: APP_CONFIG.colors.textMuted, fontSize: 12 },
  content: { gap: 10 },
});
