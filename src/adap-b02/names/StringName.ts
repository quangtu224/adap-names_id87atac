import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    private parseSource(source: string, delim: string): string[] {
        const esc = ESCAPE_CHARACTER;
        const parts: string[] = [];
        let buf = "";
        let escaped = false;
        for (const ch of source) {
            if (escaped) {
                buf += ch;
                escaped = false;
            } else if (ch === esc) {
                escaped = true;
            } else if (ch === delim) {
                parts.push(buf);
                buf = "";
            } else {
                buf += ch;
            }
        }
        parts.push(buf);
        return parts;
    }


    private ensureSingleCharDelimiter(d?: string): string {
        if (d === undefined || d === null) return this.delimiter;
        if (d.length !== 1) {
            throw new Error("Delimiter must be a single character");
        }
        return d;
    }

    private escapeForDataString(component: string): string {
        const esc = ESCAPE_CHARACTER;
        const defDelim = DEFAULT_DELIMITER;
        let out = "";
        for (const ch of component) {
            if (ch === esc || ch === defDelim) {
                out += esc;
            }
            out += ch;
        }
        return out;
    }

    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            if (delimiter.length !== 1) {
                throw new Error("Delimiter must be a single character");
            }
            this.delimiter = delimiter;
        }
        this.components = this.parseSource(source, this.delimiter);
    }


    public asString(delimiter: string = this.delimiter): string {
        const d = this.ensureSingleCharDelimiter(delimiter);
        return this.components.join(d);
    }

    public asDataString(): string {
        const escaped = this.components.map(c => this.escapeForDataString(c));
        return escaped.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError("Index out of bounds");
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError("Index out of bounds");
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new RangeError("Index out of bounds");
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError("Index out of bounds");
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        const n = other.getNoComponents();
        for (let k = 0; k < n; k++) {
            this.components.push(other.getComponent(k));
        }
    }

}