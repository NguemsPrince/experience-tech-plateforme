# 🔧 Résolution : Root Directory "frontend" Does Not Exist

## 🚨 Erreur : `The specified Root Directory "frontend" does not exist`

### Problème Identifié :

Vercel ne trouve pas le dossier `frontend` dans votre repository GitHub. Cela peut signifier :

1. **Le mauvais repository est connecté** à Vercel
2. **Le dossier frontend n'est pas dans la branche main** sur GitHub
3. **Le repository n'a pas été poussé** correctement

---

## ✅ SOLUTION 1 : Vérifier le Repository Connecté

### Dans Vercel Dashboard :

1. **Allez dans** : Settings > Git
2. **Vérifiez le repository connecté**
3. **Il devrait être** : `github.com/NguemsPrince/Mon-projet` (ou votre repository)
4. **Si c'est un autre repository**, vous devez le reconnecter

---

## ✅ SOLUTION 2 : Vérifier que frontend est sur GitHub

### Vérifiez sur GitHub :

1. **Allez sur** : https://github.com/NguemsPrince/Mon-projet
2. **Vérifiez que vous voyez le dossier `frontend/`**
3. **Cliquez dessus** pour vérifier qu'il contient `package.json`

**Si le dossier `frontend/` n'est pas visible sur GitHub :**
- Il n'a pas été poussé sur Git
- Vous devez le pousser

---

## ✅ SOLUTION 3 : Pousser le Dossier frontend sur Git

### Si frontend n'est pas sur GitHub :

```bash
cd /Users/nguemsprince/Desktop/Projet
git add frontend/
git commit -m "Add frontend directory"
git push origin main
```

**Attendez** que le push se termine, puis **redéployez** sur Vercel.

---

## ✅ SOLUTION 4 : Vérifier la Branche

### Vérifiez que vous êtes sur la bonne branche :

1. **Dans Vercel Dashboard > Settings > Git**
2. **Vérifiez "Production Branch"**
3. **Elle devrait être** : `main` (ou `master`)

**Si vous avez poussé sur une autre branche**, Vercel ne la verra pas.

---

## ✅ SOLUTION 5 : Reconnecter le Repository

### Si le repository est incorrect :

1. **Dans Vercel Dashboard > Settings > Git**
2. **Cliquez sur "Disconnect"** (si disponible)
3. **Cliquez sur "Connect Git Repository"**
4. **Sélectionnez** : `github.com/NguemsPrince/Mon-projet`
5. **Autorisez** Vercel à accéder au repository
6. **Sélectionnez la branche** : `main`

---

## 🔍 Diagnostic : Vérifier sur GitHub

### Allez sur votre repository GitHub :

**URL :** https://github.com/NguemsPrince/Mon-projet

**Vérifiez :**
- [ ] Le dossier `frontend/` est visible
- [ ] Le fichier `frontend/package.json` existe
- [ ] Vous êtes sur la branche `main`
- [ ] Les derniers commits sont visibles

**Si le dossier n'est pas là :**
- Il faut le pousser sur Git (voir Solution 3)

---

## 📋 Checklist de Vérification

- [ ] **Repository GitHub** : Le dossier `frontend/` est visible
- [ ] **Branche** : Vous êtes sur `main` (ou la branche configurée dans Vercel)
- [ ] **Vercel Git Settings** : Le bon repository est connecté
- [ ] **Production Branch** : Configurée sur `main`
- [ ] **Dossier frontend** : Contient `package.json`

---

## 🎯 Action Immédiate

### Faites ceci dans cet ordre :

1. ✅ **Vérifiez sur GitHub** : https://github.com/NguemsPrince/Mon-projet
   - Le dossier `frontend/` est-il visible ?

2. ✅ **Si NON** :
   - Poussez le dossier sur Git (Solution 3)
   - Attendez que le push se termine

3. ✅ **Si OUI** :
   - Vérifiez dans Vercel > Settings > Git
   - Le bon repository est-il connecté ?

4. ✅ **Dans Vercel Dashboard** :
   - Settings > Build and Deployment > Framework Settings
   - Root Directory = `frontend` (ou laissez vide pour tester)
   - Redéployez

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

### Option Alternative : Ne Pas Utiliser Root Directory

Si Vercel ne trouve toujours pas le dossier :

1. **Dans Vercel Dashboard > Framework Settings**
2. **Laissez "Root Directory" VIDE**
3. **Modifiez les commandes** :
   - Build Command : `cd frontend && npm run build`
   - Output Directory : `frontend/build`
   - Install Command : `cd frontend && npm ci`

4. **Cliquez sur "Save"**
5. **Redéployez**

---

**Vérifiez d'abord sur GitHub si le dossier frontend est visible, puis dites-moi ce que vous voyez !** 🚀

