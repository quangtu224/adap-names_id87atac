// Name.ts
// Complete, production-ready implementation per the provided skeleton.
// Stores components in their *masked* form internally.
// - `asString(delimiter?)` returns a human-readable string: components are *unmasked* and joined
//   by the provided delimiter without escaping.
// - `asDataString()` returns a machine-readable string using the DEFAULT_DELIMITER and escape rules.
// - All mutators (`setComponent`, `insert`, `append`) expect *masked* components.
// - Indexing is bounds-checked and throws helpful errors.

export const DEFAULT_DELIMITER = '.';
const DEFAULT_ESCAPE = '\\\\'; // a single backslash in JS/TS

export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        if (!Array.isArray(other)) {
            throw new TypeError("Name constructor expects an array of masked components");
        }
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        // Defensive copy; also validate elements are strings
        this.components = other.map((c, idx) => {
            if (typeof c !== "string") {
                throw new TypeError(`Component at index ${idx} is not a string`);
            }
            return c;
        });
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters.
     * Control characters are not escaped (creating a human-readable string).
     * Users can vary the delimiter character to be used.
     */
    public asString(delimiter?: string): string {
        const delim = delimiter ?? this.delimiter;
        if (typeof delim !== "string" || delim.length !== 1) {
            throw new TypeError("Delimiter must be a single character string");
        }
        // Unmask each component (interpret escapes) then join without escaping.
        const parts = this.components.map(c => Name.unmaskComponent(c));
        return parts.join(delim);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters.
     * Machine-readable means that from a data string, a Name can be parsed back in.
     * The control characters in the data string are the default characters.
     */
    public asDataString(): string {
        // Convert to default-masked components (unmask then remask for default delimiter)
        const remasked = this.components.map(cMasked => {
            const unmasked = Name.unmaskComponent(cMasked);
            return Name.maskComponent(unmasked, DEFAULT_DELIMITER, DEFAULT_ESCAPE);
        });
        return remasked.join(DEFAULT_DELIMITER);
    }

    public getComponent(i: number): string {
        this.ensureIndex(i);
        // Return as stored (masked form)
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        this.ensureIndex(i);
        this.ensureString(c, "c");
        this.components[i] = c;
    }

    /** Returns number of components in Name instance */
    public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        this.ensureString(c, "c");
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        this.ensureString(c, "c");
        this.components.push(c);
    }

    public remove(i: number): void {
        this.ensureIndex(i);
        this.components.splice(i, 1);
    }

    // ---- Helpers ----

    private ensureIndex(i: number): void {
        if (!Number.isInteger(i)) {
            throw new TypeError(`Index must be an integer: ${i}`);
        }
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
    }

    private ensureString(v: unknown, name: string): asserts v is string {
        if (typeof v !== "string") {
            throw new TypeError(`Expected '${name}' to be a string`);
        }
    }

    /**
     * Unmask a component by interpreting backslash escapes.
     * Any escaped character (e.g., "\.", "\\") becomes the literal character.
     */
    private static unmaskComponent(masked: string): string {
        // Replace \"any single char" with that char
        return masked.replace(/\\(.)/g, "$1");
    }

    /**
     * Mask a component by escaping backslashes and the delimiter.
     * The escape character is a single backslash. We first escape backslashes,
     * then the delimiter to avoid double-handling newly inserted backslashes.
     */
    private static maskComponent(unmasked: string, delimiter: string, escape: string): string {
        if (escape !== "\\") {
            // Our implementation assumes a single-character backslash as escape for output.
            // The parameter is present for clarity/possible future extension.
        }
        const esc = "\\"; // actual backslash character
        let s = unmasked.replace(/\\/g, esc + esc);
        // Escape the delimiter character (treat delimiter as a single character)
        const del = delimiter.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"); // escape for regex
        s = s.replace(new RegExp(del, "g"), esc + delimiter);
        return s;
    }
}
