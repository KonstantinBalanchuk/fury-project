export class EventHandler {
    public static RegisterKeyPress(event: KeyboardEvent){
        if (event.defaultPrevented) {
            return; // Should do nothing if the default action has been cancelled
        }

        const handled = false;
        if (event.key !== undefined) {
            // Handle the event with KeyboardEvent.key and set handled true.
            console.log(event.key);
        }

        if (handled) {
            // Suppress "double action" if event handled
            event.preventDefault();
        }
    }
}