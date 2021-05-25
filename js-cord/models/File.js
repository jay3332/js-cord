module.exports = class File {
    constructor(file, filename) {
        if (file instanceof Object) {
            this.file = file.file;
            this.filename = file.filename;
            this.spoiler = file.spoiler
        } else if (filename instanceof Object) {
            this.file = filename.file || file;
            this.filename = filename.filename;
            this.spoiler = filename.spoiler
        } else {
            this.file = file;
            this.filename = filename;
            this.spoiler = false
        }

        this.filename = this.filename || 'unknown';
        this.spoiler = this.spoiler || false;

        if (this.spoiler) this.filename = 'SPOILER_' + this.filename;
    }
}