const Menu = require("./Menu");
const DEFAULT_EMOJIS = {
    stop: "⏹",
    first: "⏪",
    previous: "◀",
    next: "▶",
    last: "⏩",
    jump: null,
    info: null
}

module.exports = class Paginator extends Menu {
    constructor(messageable, { emojis=DEFAULT_EMOJIS, maxPage=0, raw, restricted, user }={}) {
        super(messageable, { raw: raw, restricted: restricted, user: user });
        this.currentPage = 1;
        this.maxPage = maxPage;
        this.renderPage = async(_) {
            throw new Error("A callback is needed. See `Paginator#formatPage`");
        }
        this._mini = this.maxPage>0 && this.maxPage<=2;
        this._emojis = emojis;
        this._setup();
    }
    _setup() {
        if (this.maxPage>0 && this.maxPage===1)
            return;
        if (this._emojis.first && !this._mini)
            this.addButton(this._emojis.first, async(_, __) => {
                if (this.currentPage !== 1) {
                    this.currentPage = 1;
                    await this.renderPage(this);
                }
            });
        if (this._emojis.previous)
            this.addButton(this._emojis.previous, async(_, __) => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    await this.renderPage(this);
                }
            });
        if (this._emojis.stop)
            this.addButton(this._emojis.stop, async(_, __) => {
                this.stop();
            });
        if (this._emojis.next)
            this.addButton(this._emojis.next, async(_, __) => {
                if ((maxPage>0 && this.currentPage<this.maxPage) ||
                    (maxPage<=0))  {
                    this.currentPage++;
                    await this.renderPage(this);
                }
            });
        if (this._emojis.last && !this._mini)
            this.addButton(this._emojis.last, async(_, __) => {
                if (maxPage>0) {
                    this.currentPage=this.maxPage;
                    await this.renderPage(this);
                }
            });
        if (this._emojis.jump && !this._mini) {} // will work on this later
        if (this._emojis.info) {} // same with this one
    }
    formatPage(callback) {
        this.renderPage = async(self) => {
            const res = await callback(self);
            if ((!this.message)||(!res)) return;
            await this.message.edit(res);
        };
    }
}
