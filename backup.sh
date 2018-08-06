backup_file="backup.json"

get_contributors() {
    curl "$APP_URL/$CONTRIBUTOR_URL" > $backup_file
}

post_contributors() {
    curl -H "Authorization: Bearer $DROPBOX_ACCESS_TOKEN" https://api-content.dropbox.com/1/files_put/auto/ -T  $backup_file
}

remove_backup() {
    rm -r ./backup.json
}

get_contributors
post_contributors
remove_backup