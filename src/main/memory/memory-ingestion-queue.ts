const TASK_TIMEOUT_MS = 60_000;

function withTimeout(task: () => Promise<void>): () => Promise<void> {
  return () =>
    Promise.race([
      task(),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('MemoryIngestionQueue: task timed out')), TASK_TIMEOUT_MS)
      ),
    ]);
}

export class MemoryIngestionQueue {
  private readonly chains = new Map<string, Promise<void>>();

  enqueue(key: string, task: () => Promise<void>): Promise<void> {
    const previous = this.chains.get(key) || Promise.resolve();
    const next = previous.catch(() => undefined).then(withTimeout(task));
    this.chains.set(
      key,
      next.finally(() => {
        if (this.chains.get(key) === next) {
          this.chains.delete(key);
        }
      })
    );
    return next;
  }
}
