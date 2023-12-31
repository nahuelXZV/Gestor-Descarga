import { DownloadObserver } from "./DownloadInterface.observer";
import socketIo from 'socket.io';

export class SocketObserver implements DownloadObserver {
    constructor(private socket: socketIo.Socket) { }

    update(progress: number) {
        console.log('progress', progress);
        this.socket.emit('update', progress);
    }
}