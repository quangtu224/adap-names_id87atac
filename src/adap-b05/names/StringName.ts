import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(source !== undefined && source !== null, "source must not be null or undefined");
        this.name = source;
        this.noComponents = this.splitComponents(source).length;
    }

    /** Splits the name string into components, respecting escape characters */
    private splitComponents(str: string): string[] {
        const parts: string[] = [];
        let current = "";
        let escaped = false;

        for (const ch of str) {
            if (escaped) {
                current += ch;
                escaped = false;
            } else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
                current += ch;
            } else if (ch === this.delimiter) {
                parts.push(current);
                current = "";
            } else {
                current += ch;
            }
        }
        parts.push(current);
        return parts;
    }

    /** Unescapes a component (removes escape characters) */
    private unescapeComponent(component: string): string {
        let result = "";
        let escaped = false;

        for (const ch of component) {
            if (escaped) {
                result += ch;
                escaped = false;
            } else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
            } else {
                result += ch;
            }
        }
        if (escaped) {
            result += ESCAPE_CHARACTER;
        }
        return result;
    }

    /** Escapes a component (adds escape characters where needed) */
    private escapeComponent(component: string): string {
        let result = "";
        for (const ch of component) {
            if (ch === ESCAPE_CHARACTER || ch === this.delimiter) {
                result += ESCAPE_CHARACTER;
            }
            result += ch;
        }
        return result;
    }

    public clone(): Name {
        const cloned = new StringName(this.name, this.delimiter);
        MethodFailedException.assert(cloned.isEqual(this), "clone must be equal to original");
        return cloned;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "index out of bounds");
        const parts = this.splitComponents(this.name);
        return this.unescapeComponent(parts[i]);
    }

    public setComponent(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "index out of bounds");
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");
        const parts = this.splitComponents(this.name);
        parts[i] = this.escapeComponent(c);
        this.name = parts.join(this.delimiter);
    }

    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents, "index out of bounds");
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");
        const parts = this.splitComponents(this.name);
        parts.splice(i, 0, this.escapeComponent(c));
        this.name = parts.join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string): void {
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");
        const escaped = this.escapeComponent(c);
        if (this.noComponents === 0) {
            this.name = escaped;
        } else {
            this.name += this.delimiter + escaped;
        }
        this.noComponents++;
    }

    public remove(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "index out of bounds");
        const parts = this.splitComponents(this.name);
        parts.splice(i, 1);
        this.name = parts.join(this.delimiter);
        this.noComponents--;
    }

}