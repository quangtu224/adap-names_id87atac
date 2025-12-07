import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        InvalidStateException.assert(this.state === FileState.CLOSED, "file must be closed to open");
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(noBytes >= 0, "noBytes must be non-negative");
        InvalidStateException.assert(this.state === FileState.OPEN, "file must be open to read");

        let result: Int8Array = new Int8Array(noBytes);

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch (ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    throw new ServiceFailureException("read failed", ex);
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        InvalidStateException.assert(this.state === FileState.OPEN, "file must be open to close");
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}