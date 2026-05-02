#!/usr/bin/env bash
# sync-upstream.sh — Atualiza o fork com as novidades do repositório original
# Uso: bash scripts/sync-upstream.sh
set -e

UPSTREAM_BRANCH="main"
LOCAL_BRANCH="main"

echo "==> Verificando branch atual..."
current=$(git branch --show-current)
if [ "$current" != "$LOCAL_BRANCH" ]; then
  echo "    Mudando para branch '$LOCAL_BRANCH'..."
  git checkout "$LOCAL_BRANCH"
fi

echo "==> Verificando se há mudanças não-commitadas..."
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "    AVISO: Há mudanças não-commitadas. Commitando antes do merge..."
  git add -A
  git commit -m "chore: auto-save before upstream sync $(date +%Y-%m-%d)"
fi

echo "==> Buscando atualizações do upstream..."
git fetch upstream

echo "==> Verificando se há novidades..."
ahead=$(git rev-list --count HEAD..upstream/"$UPSTREAM_BRANCH" 2>/dev/null || echo "0")
if [ "$ahead" = "0" ]; then
  echo "    Já está atualizado! Nenhuma novidade no upstream."
  exit 0
fi

echo "    $ahead commit(s) novo(s) encontrado(s) no upstream."
echo ""
echo "==> Commits novos do criador:"
git log HEAD..upstream/"$UPSTREAM_BRANCH" --oneline
echo ""

echo "==> Mesclando upstream/$UPSTREAM_BRANCH..."
if git merge upstream/"$UPSTREAM_BRANCH" --no-edit; then
  echo ""
  echo "✅ Merge concluído sem conflitos!"
  echo "   Suas features estão preservadas e o upstream foi integrado."
else
  echo ""
  echo "⚠️  CONFLITOS DETECTADOS. O Git pausou o merge."
  echo ""
  echo "   Arquivos com conflito:"
  git diff --name-only --diff-filter=U
  echo ""
  echo "   O que fazer:"
  echo "   1. Abra os arquivos listados acima"
  echo "   2. Procure por <<<<<<< HEAD e resolva os conflitos"
  echo "   3. Cole o arquivo no Claude e peça: 'Resolva o conflito mantendo minha feature X'"
  echo "   4. Depois: git add <arquivo> && git commit"
  echo ""
  echo "   Para CANCELAR o merge e voltar ao estado anterior:"
  echo "   git merge --abort"
  exit 1
fi
