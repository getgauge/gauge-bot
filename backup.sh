backup_file="$(date '+%F')_cla_backup.json"

get_contributors() {
    curl "$APP_URL/$CONTRIBUTOR_URL" > $backup_file
}

post_contributors() {
    aws s3 cp $backup_file "s3://$BACKUP_BUCKET_NAME"
}

remove_backup() {
    rm -r $backup_file
}

get_contributors
post_contributors
remove_backup