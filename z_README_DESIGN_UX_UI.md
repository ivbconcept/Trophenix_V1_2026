# 🎨 Guide Design, UX & UI - Trophenix

## 📝 Historique du document

| Date | Version | Lignes | Modifications | Auteur |
|------|---------|--------|---------------|--------|
| 2025-01-11 | 1.0 | 878 | Création guide design complet (palette, typo, composants) | Claude |

---

## 📌 Vue d'ensemble

Ce document présente les principes de design, l'expérience utilisateur (UX) et l'interface utilisateur (UI) de la plateforme Trophenix.

**Philosophie de design** : Minimaliste, professionnel, accessible et centré sur l'utilisateur.

---

## 🎯 Principes de design

### 1. Clarté avant tout

Chaque élément doit avoir un but clair. Pas de décoration inutile.

```
❌ Mauvais : Animations flashy, couleurs vives partout
✅ Bon : Animations subtiles, palette neutre, focus sur le contenu
```

### 2. Hiérarchie visuelle

L'utilisateur doit immédiatement comprendre ce qui est important.

```
Hiérarchie typographique :
- H1 : 5xl (48px) → Titre principal de page
- H2 : 3xl (30px) → Sections majeures
- H3 : xl (20px) → Sous-sections
- Body : base (16px) → Texte courant
- Small : sm (14px) → Labels, metadata
```

### 3. Cohérence

Même design pattern partout dans l'application.

```
Buttons primaires : bg-slate-900 text-white
Buttons secondaires : bg-slate-100 text-slate-700
Inputs : border-slate-300 focus:border-slate-900
```

### 4. Accessibilité (WCAG 2.1 Level AA)

- ✅ Contraste minimum 4.5:1 pour le texte
- ✅ Taille de police minimum 16px
- ✅ Zone de clic minimum 44x44px
- ✅ Navigation au clavier
- ✅ Labels sur tous les inputs

---

## 🎨 Système de design

### Palette de couleurs

#### Couleurs principales

```css
/* Slate (Gris neutre) - Couleur principale */
slate-50:   #f8fafc  /* Backgrounds légers */
slate-100:  #f1f5f9  /* Backgrounds secondaires */
slate-200:  #e2e8f0  /* Borders, dividers */
slate-300:  #cbd5e1  /* Disabled states */
slate-600:  #475569  /* Text secondaire */
slate-700:  #334155  /* Text tertiaire */
slate-900:  #0f172a  /* Text principal, boutons primaires */

/* Amber (Statuts en attente) */
amber-100:  #fef3c7  /* Background warning */
amber-600:  #d97706  /* Icône warning */

/* Green (Succès, validation) */
green-100:  #dcfce7  /* Background success */
green-600:  #16a34a  /* Icône success */

/* Red (Erreurs) */
red-100:    #fee2e2  /* Background error */
red-600:    #dc2626  /* Icône error */
```

#### Pourquoi Slate ?

- Professionnel et moderne
- Excellent pour le texte (lisibilité)
- Neutre (pas de connotation émotionnelle forte)
- Fonctionne bien avec des accents colorés

#### Règles d'utilisation

```typescript
// ✅ Bon usage
<button className="bg-slate-900 text-white">
  Primary Action
</button>

<div className="bg-slate-50 text-slate-900">
  Content Area
</div>

// ❌ Mauvais usage (trop de contraste)
<button className="bg-red-600 text-yellow-400">
  Bad Contrast
</button>
```

---

### Typographie

#### Font Family

```css
/* Système de fonts par défaut (excellent pour la performance) */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

Pourquoi les fonts système ?
- ✅ Chargement instantané (0ms)
- ✅ Familiarité pour l'utilisateur
- ✅ Excellente lisibilité
- ✅ Pas de requête HTTP supplémentaire

#### Échelle typographique

```css
/* Tailwind scale utilisée */
text-xs:   12px  /* Metadata, timestamps */
text-sm:   14px  /* Labels, captions */
text-base: 16px  /* Body text (défaut) */
text-lg:   18px  /* Emphasis, lead text */
text-xl:   20px  /* H3, card titles */
text-2xl:  24px  /* H2 small */
text-3xl:  30px  /* H2 */
text-4xl:  36px  /* H1 small */
text-5xl:  48px  /* H1 */
text-6xl:  60px  /* Hero titles */
```

#### Line Height

```css
/* Ajusté selon le contexte */
leading-tight:   1.25  /* Headings (H1, H2, H3) */
leading-normal:  1.5   /* Body text (paragraphes) */
leading-relaxed: 1.75  /* Long-form content */
```

#### Font Weight

```css
font-normal:    400  /* Body text */
font-medium:    500  /* Emphasis, buttons */
font-semibold:  600  /* Headings H3 */
font-bold:      700  /* Headings H1, H2 */
```

---

### Espacements

#### Système 8px

Tous les espacements sont des multiples de 8px (ou 0.25rem).

```css
/* Tailwind spacing scale */
space-1:  0.25rem  /* 4px  - Micro spacing */
space-2:  0.5rem   /* 8px  - Tight spacing */
space-4:  1rem     /* 16px - Default spacing */
space-6:  1.5rem   /* 24px - Medium spacing */
space-8:  2rem     /* 32px - Large spacing */
space-12: 3rem     /* 48px - XL spacing */
space-16: 4rem     /* 64px - Section spacing */
space-20: 5rem     /* 80px - Hero spacing */
```

#### Utilisation

```tsx
// ✅ Bon usage (multiples de 8px)
<div className="p-4 space-y-6">
  <h2 className="mb-4">Title</h2>
  <p className="mb-8">Paragraph</p>
</div>

// ❌ Mauvais usage (valeurs arbitraires)
<div className="p-[13px] space-y-[23px]">
  Inconsistent spacing
</div>
```

---

### Borders & Shadows

#### Borders

```css
/* Border radius */
rounded-none: 0px      /* Cards sharp */
rounded-sm:   2px      /* Tags */
rounded:      4px      /* Inputs */
rounded-lg:   8px      /* Buttons, cards */
rounded-xl:   12px     /* Modals */
rounded-2xl:  16px     /* Hero sections */
rounded-full: 9999px   /* Pills, avatars */

/* Border width */
border:   1px  /* Default borders */
border-2: 2px  /* Emphasis borders */
```

#### Shadows

```css
shadow-sm:  0 1px 2px rgba(0,0,0,0.05)    /* Subtle cards */
shadow:     0 1px 3px rgba(0,0,0,0.1)     /* Cards */
shadow-lg:  0 10px 15px rgba(0,0,0,0.1)   /* Modals, popovers */
shadow-xl:  0 20px 25px rgba(0,0,0,0.1)   /* Hero cards */
```

---

## 🖥️ Composants UI

### Buttons

#### Styles de boutons

```tsx
// Primary Button (Action principale)
<button className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors">
  Créer un compte
</button>

// Secondary Button (Action secondaire)
<button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors">
  Annuler
</button>

// Ghost Button (Action tertiaire)
<button className="px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition-colors">
  En savoir plus
</button>

// Disabled Button
<button
  disabled
  className="px-6 py-3 bg-slate-300 text-slate-500 rounded-lg cursor-not-allowed"
>
  Indisponible
</button>
```

#### Sizes

```tsx
// Small
<button className="px-4 py-2 text-sm">Small</button>

// Medium (default)
<button className="px-6 py-3 text-base">Medium</button>

// Large
<button className="px-8 py-4 text-lg">Large</button>
```

#### Icons in buttons

```tsx
<button className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-lg">
  <ArrowRight className="h-5 w-5" />
  <span>Continuer</span>
</button>
```

---

### Inputs & Forms

#### Text Input

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-slate-700">
    Email
  </label>
  <input
    type="email"
    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20 outline-none transition-colors"
    placeholder="athlete@example.com"
  />
</div>
```

#### Select

```tsx
<select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-900 outline-none">
  <option>Sélectionnez un sport</option>
  <option>Football</option>
  <option>Basketball</option>
  <option>Tennis</option>
</select>
```

#### Textarea

```tsx
<textarea
  rows={4}
  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-900 resize-none outline-none"
  placeholder="Décrivez votre parcours..."
/>
```

#### Error State

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-slate-700">
    Email
  </label>
  <input
    type="email"
    className="w-full px-4 py-3 border border-red-600 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-600 focus:ring-opacity-20"
  />
  <p className="text-sm text-red-600">
    Veuillez entrer une adresse email valide
  </p>
</div>
```

---

### Cards

#### Standard Card

```tsx
<div className="bg-white rounded-2xl shadow-lg p-8">
  <h2 className="text-2xl font-bold text-slate-900 mb-4">
    Titre de la carte
  </h2>
  <p className="text-slate-600">
    Contenu de la carte avec description.
  </p>
</div>
```

#### Hover Card

```tsx
<div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer">
  <h3 className="text-xl font-semibold text-slate-900 mb-2">
    Profil Athlète
  </h3>
  <p className="text-slate-600">
    Jean Dupont - Football
  </p>
</div>
```

---

### Icons

Utilisation de **Lucide React** (choisi pour sa cohérence et sa taille légère).

```tsx
import { Trophy, Users, Briefcase, Check, X, ArrowRight } from 'lucide-react';

// Icon seul
<Trophy className="h-6 w-6 text-slate-700" />

// Icon avec texte
<div className="flex items-center space-x-2">
  <Check className="h-5 w-5 text-green-600" />
  <span>Validé</span>
</div>

// Icon dans cercle
<div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full">
  <Trophy className="h-8 w-8 text-slate-700" />
</div>
```

---

### Badges & Pills

```tsx
// Status Badge
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  Approuvé
</span>

<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
  En attente
</span>

<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
  Refusé
</span>
```

---

### Modals

```tsx
<div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
    <h2 className="text-2xl font-bold text-slate-900 mb-4">
      Titre du modal
    </h2>
    <p className="text-slate-600 mb-6">
      Contenu du modal avec description.
    </p>
    <div className="flex space-x-4">
      <button className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg">
        Confirmer
      </button>
      <button className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg">
        Annuler
      </button>
    </div>
  </div>
</div>
```

---

## 📱 Responsive Design

### Breakpoints Tailwind

```css
/* Mobile first approach */
sm:  640px   /* Tablets portrait */
md:  768px   /* Tablets landscape */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* XL desktop */
```

### Patterns responsive

#### Stack mobile, Grid desktop

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Cards */}
</div>
```

#### Hide on mobile

```tsx
<div className="hidden md:block">
  Desktop only content
</div>
```

#### Different sizes

```tsx
<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
  Responsive Title
</h1>
```

---

## 🎭 Animations & Transitions

### Principes

1. **Subtiles** : Les animations doivent aider, pas distraire
2. **Rapides** : 150-300ms maximum
3. **Naturelles** : Ease-out pour les entrées, ease-in pour les sorties

### Transitions CSS

```css
/* Tailwind utilities */
transition-colors    /* Pour hover states */
transition-all       /* Pour transformations complexes */
transition-opacity   /* Pour fade in/out */

duration-150  /* 150ms - Micro interactions */
duration-300  /* 300ms - Standard */
duration-500  /* 500ms - Slow (rarement utilisé) */

ease-in       /* Accélération (sortie) */
ease-out      /* Décélération (entrée) */
ease-in-out   /* Les deux */
```

### Exemples

```tsx
// Hover transition
<button className="bg-slate-900 hover:bg-slate-800 transition-colors duration-300">
  Hover me
</button>

// Scale on hover
<div className="hover:scale-105 transition-transform duration-300">
  Card
</div>

// Fade in
<div className="opacity-0 animate-fade-in">
  Content
</div>
```

---

## 🚀 Patterns UX

### Navigation

#### Navigation principale (Navbar)

```tsx
<nav className="bg-white shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Trophy className="h-8 w-8 text-slate-700" />
        <span className="text-2xl font-bold text-slate-900">Trophenix</span>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button>Se connecter</button>
        <button>Créer un compte</button>
      </div>
    </div>
  </div>
</nav>
```

#### Breadcrumbs

```tsx
<nav className="flex items-center space-x-2 text-sm">
  <a href="/" className="text-slate-600 hover:text-slate-900">Accueil</a>
  <span className="text-slate-400">/</span>
  <a href="/athletes" className="text-slate-600 hover:text-slate-900">Athlètes</a>
  <span className="text-slate-400">/</span>
  <span className="text-slate-900 font-medium">Jean Dupont</span>
</nav>
```

---

### Forms UX

#### Multi-step form

```tsx
// Step indicator
<div className="flex items-center justify-center space-x-4 mb-8">
  <div className="flex items-center">
    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
      1
    </div>
    <span className="ml-2 text-sm font-medium">Identité</span>
  </div>

  <div className="w-16 h-0.5 bg-slate-300" />

  <div className="flex items-center">
    <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center">
      2
    </div>
    <span className="ml-2 text-sm text-slate-600">Carrière</span>
  </div>

  <div className="w-16 h-0.5 bg-slate-300" />

  <div className="flex items-center">
    <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center">
      3
    </div>
    <span className="ml-2 text-sm text-slate-600">Projet</span>
  </div>
</div>
```

#### Inline validation

```tsx
// ✅ Validation réussie
<div className="relative">
  <input
    type="email"
    className="w-full px-4 py-3 border border-green-600 rounded-lg"
    value="athlete@example.com"
  />
  <Check className="absolute right-4 top-3.5 h-5 w-5 text-green-600" />
</div>

// ❌ Validation échouée
<div className="relative">
  <input
    type="email"
    className="w-full px-4 py-3 border border-red-600 rounded-lg"
    value="invalid"
  />
  <X className="absolute right-4 top-3.5 h-5 w-5 text-red-600" />
</div>
```

---

### Loading States

#### Skeleton

```tsx
<div className="space-y-4">
  <div className="h-8 bg-slate-200 rounded animate-pulse" />
  <div className="h-4 bg-slate-200 rounded animate-pulse" />
  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
</div>
```

#### Spinner

```tsx
<div className="flex items-center justify-center">
  <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-900" />
</div>
```

---

### Empty States

```tsx
<div className="text-center py-20">
  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6">
    <Users className="h-8 w-8 text-slate-400" />
  </div>
  <h3 className="text-xl font-semibold text-slate-900 mb-2">
    Aucun athlète trouvé
  </h3>
  <p className="text-slate-600 mb-6">
    Essayez de modifier vos filtres de recherche.
  </p>
  <button className="px-6 py-3 bg-slate-900 text-white rounded-lg">
    Réinitialiser les filtres
  </button>
</div>
```

---

## 🎨 Layouts

### Hero Section

```tsx
<section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
      Un seul espace pour gérer<br />votre carrière sportive
    </h1>
    <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
      Trophenix regroupe les outils et l'écosystème sportif dans un seul espace.
    </p>
    <button className="px-8 py-4 bg-slate-900 text-white rounded-lg text-lg">
      Commencer maintenant
    </button>
  </div>
</section>
```

### Feature Grid

```tsx
<div className="grid md:grid-cols-3 gap-8">
  {features.map(feature => (
    <div key={feature.id} className="text-center p-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
        <feature.icon className="h-8 w-8 text-slate-700" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {feature.title}
      </h3>
      <p className="text-slate-600">
        {feature.description}
      </p>
    </div>
  ))}
</div>
```

---

## ♿ Accessibilité

### Focus States

```tsx
// Toujours visible
<button className="focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 outline-none">
  Accessible Button
</button>

<input className="focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
```

### Screen Readers

```tsx
// aria-label pour les icônes
<button aria-label="Fermer le modal">
  <X className="h-5 w-5" />
</button>

// aria-describedby pour les hints
<input
  id="email"
  aria-describedby="email-hint"
/>
<p id="email-hint" className="text-sm text-slate-600">
  Nous ne partagerons jamais votre email
</p>
```

### Keyboard Navigation

```tsx
// Ordre logique de tabulation
<form>
  <input tabIndex={1} />
  <input tabIndex={2} />
  <button tabIndex={3}>Submit</button>
</form>

// Skip to content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Aller au contenu principal
</a>
```

---

## 📊 Performance

### Image Optimization

```tsx
// Lazy loading
<img
  src="athlete.jpg"
  loading="lazy"
  alt="Jean Dupont"
  className="w-full h-auto"
/>

// Responsive images
<img
  srcSet="
    athlete-320w.jpg 320w,
    athlete-640w.jpg 640w,
    athlete-1280w.jpg 1280w
  "
  sizes="(max-width: 640px) 100vw, 50vw"
  src="athlete-640w.jpg"
  alt="Jean Dupont"
/>
```

### Code Splitting

```tsx
// Lazy loading components
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <AdminDashboard />
    </Suspense>
  );
}
```

---

## 🧪 Testing Design

### Checklist

- [ ] Toutes les couleurs ont un contraste suffisant (4.5:1)
- [ ] Toutes les polices sont lisibles (16px minimum)
- [ ] Tous les boutons sont cliquables (44x44px minimum)
- [ ] Navigation au clavier fonctionne
- [ ] Focus states visibles
- [ ] Responsive sur mobile, tablet, desktop
- [ ] Animations subtiles et performantes
- [ ] Loading states pour toutes les actions async
- [ ] Error states pour tous les inputs
- [ ] Empty states pour toutes les listes

### Outils

```bash
# Lighthouse audit (dans Chrome DevTools)
# Performance, Accessibility, Best Practices, SEO

# axe DevTools (extension Chrome)
# Détection automatique des problèmes d'accessibilité

# Color Contrast Analyzer
# Vérifier les ratios de contraste
```

---

## 📚 Ressources

### Design Systems de référence

- [Tailwind UI](https://tailwindui.com/) - Components & patterns
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [Radix UI](https://www.radix-ui.com/) - Headless components
- [Lucide Icons](https://lucide.dev/) - Icon library

### Inspiration

- [Dribbble](https://dribbble.com/) - Design inspiration
- [Mobbin](https://mobbin.com/) - Mobile & web patterns
- [Awwwards](https://www.awwwards.com/) - Award-winning designs

### Documentation

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://m3.material.io/) - Principes généraux

---

## ✅ Résumé

### Système de design Trophenix

| Aspect | Choix | Raison |
|--------|-------|--------|
| **Couleurs** | Slate (gris neutre) | Professionnel, lisible, moderne |
| **Typographie** | System fonts | Performance, familiarité |
| **Espacements** | Système 8px | Cohérence, alignement |
| **Borders** | 8px (rounded-lg) | Doux mais pas trop arrondi |
| **Shadows** | Subtiles | Profondeur sans exagération |
| **Animations** | 150-300ms | Réactif sans être distrayant |
| **Icons** | Lucide React | Cohérent, léger, SVG |

### Principes clés

1. **Clarté** : Chaque élément a un but
2. **Cohérence** : Même pattern partout
3. **Accessibilité** : WCAG 2.1 Level AA
4. **Performance** : Lazy loading, optimisation
5. **Mobile-first** : Responsive par défaut

**Design system complet et prêt pour le développement !** 🎨


