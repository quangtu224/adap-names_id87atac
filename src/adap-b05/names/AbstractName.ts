import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    protected static maskComponent(component: string, delimiter: string): string {
        let result = "";
        for (const ch of component) {
            if (ch === ESCAPE_CHARACTER || ch === delimiter) {
                result += ESCAPE_CHARACTER;
            }
            result += ch;
        }
        return result;
    }

    protected static unmaskComponent(component: string, delimiter: string): string {
        let result = "";
        let escapeNext = false;

        for (const ch of component) {
            if (escapeNext) {
                result += ch;
                escapeNext = false;
            } else if (ch === ESCAPE_CHARACTER) {
                escapeNext = true;
            } else {
                result += ch;
            }
        }

        // Trailing escape character – treat it as literal.
        if (escapeNext) {
            result += ESCAPE_CHARACTER;
        }

        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        const n = this.getNoComponents();
        const parts: string[] = [];
        for (let i = 0; i < n; i++) {
            const component = this.getComponent(i);
            parts.push(AbstractName.maskComponent(component, delimiter));
        }
        return parts.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other !== undefined && other !== null, "other must not be null or undefined");
        const n = this.getNoComponents();
        if (n !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < n; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            const component = this.getComponent(i);
            for (let j = 0; j < component.length; j++) {
                hash = (hash * 31 + component.charCodeAt(j)) >>> 0;
            }
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        IllegalArgumentException.assert(other !== undefined && other !== null, "other must not be null or undefined");
        const n = other.getNoComponents();
        for (let i = 0; i < n; i++) {
            this.append(other.getComponent(i));
        }
    }

}