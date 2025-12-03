# 🔧 Résolution : Fichiers Volumineux sur GitHub

## 🚨 Problème

GitHub rejette le push car des fichiers MongoDB volumineux (>100MB) sont présents dans l'historique Git :

- `mongodb-macos-x86_64-7.0.5/bin/mongod` (163.07 MB)
- `mongodb-macos-x86_64-7.0.5/bin/mongos` (115.53 MB)
- Plusieurs fichiers WiredTiger (>50MB)

---

## ✅ Solution : Nettoyer l'Historique Git

### Option 1 : Utiliser le Script Automatique (Recommandé)

```bash
# Exécuter le script de nettoyage
./cleanup-git-history.sh

# Forcer le push (ATTENTION: réécrit l'historique)
git push origin main --force
```

### Option 2 : Nettoyage Manuel

```bash
# 1. Supprimer les fichiers de l'historique Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch -r mongodb-macos-x86_64-7.0.5/ data/db/ data/journal/ mongodb-local/ mongodb-data/ mongodb.tgz" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Nettoyer les références
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 3. Forcer le push
git push origin main --force
```

---

## ⚠️ IMPORTANT : Avant de Forcer le Push

1. **Vérifiez que personne d'autre ne travaille sur le dépôt**
2. **Sauvegardez votre travail local** (les fichiers MongoDB restent sur votre machine)
3. **Informez votre équipe** si vous travaillez en groupe

---

## 🔍 Vérification

### Vérifier que les fichiers sont bien ignorés :

```bash
# Vérifier .gitignore
grep -E "(mongodb|data/)" .gitignore

# Vérifier qu'ils ne sont plus suivis
git ls-files | grep -E "(mongodb|data/db)"
```

---

## 📋 Alternative : Utiliser Git LFS (Si Nécessaire)

Si vous devez absolument garder ces fichiers dans Git (non recommandé) :

```bash
# Installer Git LFS
git lfs install

# Suivre les fichiers MongoDB
git lfs track "mongodb-macos-x86_64-7.0.5/**"
git lfs track "data/db/**"

# Ajouter .gitattributes
git add .gitattributes
git commit -m "Add Git LFS tracking for MongoDB files"
```

**Note** : Git LFS n'est pas recommandé pour les binaires MongoDB. Il vaut mieux les exclure complètement.

---

## ✅ Après le Nettoyage

Une fois le push réussi :

1. ✅ Les fichiers MongoDB restent sur votre machine locale
2. ✅ Ils sont ignorés par Git (via .gitignore)
3. ✅ L'historique Git est propre
4. ✅ Le push fonctionne normalement

---

## 🎯 Résultat Attendu

Après le nettoyage et le push forcé :

```bash
git push origin main --force
# ✅ Push réussi !
```

---

## 🆘 Si le Problème Persiste

Si GitHub refuse toujours après le nettoyage :

1. **Vérifiez les logs** : `git log --all --full-history -- "mongodb-macos-x86_64-7.0.5/**"`
2. **Utilisez BFG Repo-Cleaner** (plus rapide que filter-branch) :
   ```bash
   # Télécharger BFG: https://rtyley.github.io/bfg-repo-cleaner/
   java -jar bfg.jar --delete-folders mongodb-macos-x86_64-7.0.5
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push origin main --force
   ```

---

✅ **Les fichiers MongoDB ne doivent JAMAIS être dans Git !** Ils sont déjà dans `.gitignore`, mais ils étaient dans l'historique avant l'ajout de cette règle.

