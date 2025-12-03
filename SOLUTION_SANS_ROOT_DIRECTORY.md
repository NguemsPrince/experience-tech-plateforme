# 🔧 Solution : Configurer Sans Root Directory

## 🚨 Problème : Root Directory Ne Peut Pas Être Changé

Si vous ne pouvez pas modifier Root Directory, modifiez les **commandes** pour inclure `cd frontend`.

---

## ✅ SOLUTION : Modifier les Commandes

### Dans Vercel Dashboard :

1. **Allez dans** : Settings > Build and Deployment > Framework Settings
2. **Laissez Root Directory** tel quel (ne le changez pas)
3. **Modifiez les commandes** :

---

## 📋 Configuration des Commandes

### Install Command :

**Changez de :**
```
npm install --legacy-peer-deps
```

**En :**
```
cd frontend && npm install --legacy-peer-deps
```

---

### Build Command :

**Changez de :**
```
npm run build
```

**En :**
```
cd frontend && npm run build
```

---

### Output Directory :

**Changez de :**
```
build
```

**En :**
```
frontend/build
```

---

## ✅ Configuration Complète

### Dans Framework Settings :

```
Root Directory: (LAISSEZ TEL QUEL - ne changez pas)
Build Command: cd frontend && npm install --legacy-peer-deps && npm run build
Output Directory: frontend/build
Install Command: cd frontend && npm install --legacy-peer-deps
```

**OU séparément :**

```
Install Command: cd frontend && npm install --legacy-peer-deps
Build Command: cd frontend && npm run build
Output Directory: frontend/build
```

---

## 🔍 Comment Modifier les Commandes

### Dans Framework Settings :

1. **Trouvez "Install Command"**
2. **Cliquez dans le champ** (ou sur "Edit" si c'est un toggle)
3. **Activez le toggle "Override"** si nécessaire (pour rendre le champ éditable)
4. **Tapez** : `cd frontend && npm install --legacy-peer-deps`
5. **Faites de même pour "Build Command"** : `cd frontend && npm run build`
6. **Modifiez "Output Directory"** : `frontend/build`
7. **Cliquez sur "Save"**

---

## 📋 Checklist

- [ ] **Install Command** modifié : `cd frontend && npm install --legacy-peer-deps`
- [ ] **Build Command** modifié : `cd frontend && npm run build`
- [ ] **Output Directory** modifié : `frontend/build`
- [ ] **Tous les toggles "Override"** activés (si nécessaire)
- [ ] **Changements sauvegardés**
- [ ] **Projet redéployé**

---

## 🎯 Action Immédiate

### Faites ceci MAINTENANT :

1. ✅ **Allez dans** : Settings > Build and Deployment > Framework Settings
2. ✅ **Trouvez "Install Command"**
3. ✅ **Activez le toggle "Override"** (cliquez dessus pour qu'il devienne bleu)
4. ✅ **Tapez** : `cd frontend && npm install --legacy-peer-deps`
5. ✅ **Trouvez "Build Command"**
6. ✅ **Activez le toggle "Override"**
7. ✅ **Tapez** : `cd frontend && npm run build`
8. ✅ **Trouvez "Output Directory"**
9. ✅ **Activez le toggle "Override"**
10. ✅ **Tapez** : `frontend/build`
11. ✅ **Cliquez sur "Save"**
12. ✅ **Redéployez**

---

## 🆘 Si les Champs Ne Sont Pas Éditables

### Si vous ne voyez pas les toggles "Override" :

1. **Cherchez** une section "Project Settings" (différente de "Production Overrides")
2. **Ouvrez-la** (cliquez dessus)
3. **Modifiez les commandes** là-bas
4. **OU** cherchez "Build Settings" dans le menu de gauche

---

**Modifiez les commandes pour inclure `cd frontend &&` et dites-moi si ça fonctionne !** 🚀

