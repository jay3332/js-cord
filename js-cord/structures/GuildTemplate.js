module.exports = class GuildTemplate {
  constructor(client, data) {
    this.code = data.code;
    this.name = data.name;
    this.description = data.description;
    this.uses = data.usage_count;
    this.creator = data.creator;
    this.creatorID = data.creator_id; // for fetchCreator
    this.createdTimestamp = new Date(data.created_at);
    this.editedTimestamp = new Date(data.updated_at);
    this.guild = client.getGuild(data.source_guild_id) || data.source_guild_id;
    this.guildID = data.source_guild_id; // will 100% be present
    this.preview = data.serialized_source_guild;
    this.unsynced = data.is_dirty;
  }
  async fetchCreator() {
    // this.client.fetchUser(this.creatorID)
  }
  async delete() {
    return await this.client.http.deleteWebhook(this.guildID, this.code);
  }
}
