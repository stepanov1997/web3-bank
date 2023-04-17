import { useState } from 'react';

function useAsyncSemaphore() {
    const [isRunning, setIsRunning] = useState(false);

    async function acquire() {
        while (isRunning) {
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        setIsRunning(true);
    }

    function release() {
        setIsRunning(false);
    }

    return { acquire, release };
}

export default useAsyncSemaphore;