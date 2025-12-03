# 🎨 Guide des Animations - Expérience Tech

Ce guide explique comment utiliser le système d'animations avancé intégré à la plateforme Expérience Tech.

## 📦 Composants d'Animation Disponibles

### 1. PageTransition
Transitions fluides entre les pages.

```jsx
import { PageTransition } from './components/animations';

<PageTransition>
  <YourPageComponent />
</PageTransition>
```

### 2. AnimatedSection
Animations au scroll avec détection de visibilité.

```jsx
import { AnimatedSection } from './components/animations';

<AnimatedSection direction="up" delay={0.2} duration={0.6}>
  <YourContent />
</AnimatedSection>
```

**Props disponibles :**
- `direction`: "up" | "down" | "left" | "right"
- `delay`: nombre (délai en secondes)
- `duration`: nombre (durée en secondes)
- `distance`: nombre (distance d'animation en pixels)

### 3. AnimatedButton
Boutons avec effets hover et tap avancés.

```jsx
import { AnimatedButton } from './components/animations';

<AnimatedButton 
  variant="primary" 
  size="large"
  onClick={handleClick}
>
  Cliquer ici
</AnimatedButton>
```

**Variantes :** `primary`, `secondary`, `outline`, `ghost`
**Tailles :** `small`, `medium`, `large`

### 4. AnimatedCard
Cartes avec effets de survol élégants.

```jsx
import { AnimatedCard } from './components/animations';

<AnimatedCard hoverScale={1.05} initialDelay={0.3}>
  <CardContent />
</AnimatedCard>
```

### 5. AnimatedText
Animation de texte avec effet de frappe.

```jsx
import { AnimatedText } from './components/animations';

<AnimatedText 
  text="Votre texte ici"
  className="text-4xl font-bold"
  delay={0.5}
  staggerChildren={0.1}
/>
```

### 6. AnimatedCounter
Compteurs animés avec courbes d'accélération.

```jsx
import { AnimatedCounter } from './components/animations';

<AnimatedCounter 
  end={1000} 
  duration={2} 
  suffix="+" 
  prefix="$"
  delay={0.5}
/>
```

### 7. AnimatedIcon
Icônes avec diverses animations.

```jsx
import { AnimatedIcon } from './components/animations';

<AnimatedIcon animation="pulse" delay={0.3}>
  <YourIcon />
</AnimatedIcon>
```

**Animations disponibles :** `hover`, `pulse`, `rotate`, `bounce`, `float`

### 8. ParallaxSection
Effets de parallaxe basés sur le scroll.

```jsx
import { ParallaxSection } from './components/animations';

<ParallaxSection speed={0.5}>
  <ParallaxContent />
</ParallaxSection>
```

### 9. RevealAnimation
Animations de révélation progressive.

```jsx
import { RevealAnimation } from './components/animations';

<RevealAnimation direction="up" distance={50}>
  <ContentToReveal />
</RevealAnimation>
```

## 🎭 Classes CSS d'Animation

### Animations de base
```css
.animate-float          /* Animation de flottement */
.animate-pulse-glow     /* Pulsation avec effet de lueur */
.animate-slide-in-left  /* Glissement depuis la gauche */
.animate-slide-in-right /* Glissement depuis la droite */
.animate-slide-in-up    /* Glissement depuis le bas */
.animate-slide-in-down  /* Glissement depuis le haut */
.animate-fade-in        /* Apparition en fondu */
.animate-scale-in       /* Apparition avec agrandissement */
.animate-bounce-in      /* Apparition avec rebond */
.animate-rotate-in      /* Apparition avec rotation */
.animate-shake          /* Animation de secousse */
```

### Effets de survol
```css
.hover-lift    /* Élévation au survol */
.hover-scale   /* Agrandissement au survol */
.hover-glow    /* Effet de lueur au survol */
```

### Animations de texte
```css
.text-shimmer     /* Effet de brillance sur le texte */
.loading-dots     /* Points de chargement animés */
```

### Délais d'animation
```css
.stagger-1  /* Délai de 0.1s */
.stagger-2  /* Délai de 0.2s */
.stagger-3  /* Délai de 0.3s */
/* ... jusqu'à .stagger-10 */
```

## 🛠️ Utilisation Avancée

### Variantes d'animation prédéfinies
```jsx
import { animationVariants, springTransition, smoothTransition } from './components/animations';

<motion.div
  variants={animationVariants.fadeInUp}
  initial="initial"
  animate="animate"
  transition={springTransition}
>
  Contenu animé
</motion.div>
```

### Animations personnalisées avec Framer Motion
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, scale: 0 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 20
  }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
>
  Élément interactif
</motion.div>
```

## 📱 Optimisation des Performances

### Bonnes pratiques
1. **Utilisez `viewport={{ once: true }}`** pour les animations au scroll
2. **Limitez le nombre d'animations simultanées** sur mobile
3. **Utilisez `transform` et `opacity`** plutôt que d'autres propriétés CSS
4. **Testez sur des appareils moins puissants**

### Désactivation des animations (accessibilité)
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🎯 Exemples d'Intégration

### Page d'accueil avec animations
```jsx
import { 
  AnimatedSection, 
  AnimatedText, 
  AnimatedCounter,
  RevealAnimation 
} from './components/animations';

const HomePage = () => (
  <div>
    <AnimatedSection direction="up">
      <AnimatedText 
        text="Bienvenue chez Expérience Tech"
        className="text-6xl font-bold"
        delay={0.3}
      />
    </AnimatedSection>
    
    <AnimatedSection direction="left" delay={0.5}>
      <div className="grid grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <RevealAnimation key={index} delay={index * 0.1}>
            <div>
              <AnimatedCounter 
                end={stat.number} 
                suffix={stat.suffix}
                duration={2}
              />
              <p>{stat.label}</p>
            </div>
          </RevealAnimation>
        ))}
      </div>
    </AnimatedSection>
  </div>
);
```

### Navigation animée
```jsx
import { motion } from 'framer-motion';

const NavItem = ({ children, href }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link 
      href={href}
      className="relative group"
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-primary-600"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      />
    </Link>
  </motion.div>
);
```

## 🚀 Conseils pour des Animations Parfaites

1. **Timing** : Gardez les animations entre 0.2s et 0.8s
2. **Easing** : Utilisez des courbes naturelles comme `ease-out`
3. **Hiérarchie** : Animez les éléments importants en premier
4. **Cohérence** : Utilisez les mêmes paramètres dans toute l'application
5. **Feedback** : Donnez toujours un retour visuel aux interactions

## 🎨 Personnalisation

Vous pouvez facilement personnaliser les animations en modifiant :
- Les fichiers dans `/src/components/animations/`
- Les classes CSS dans `/src/styles/animations.css`
- Les variantes dans `/src/components/animations/index.js`

---

**Note** : Ce système d'animations est optimisé pour les performances et l'accessibilité. Il respecte les préférences utilisateur pour les animations réduites.
