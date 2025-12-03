BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

pg_dump -h localhost -U ordino -d ordino_dev > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup criado: $BACKUP_FILE"
    ls -lh "$BACKUP_FILE"
else
    echo "❌ Erro ao criar backup"
    exit 1
fi